require "jwt"

class User < ApplicationRecord
  belongs_to :group, optional: true

  devise :omniauthable, :omniauth_providers => [:google_oauth2]

  encrypts :token
  encrypts :refresh_token

  before_save :set_blob_id, if: :will_save_change_to_group_id?

  def self.from_omniauth(auth)
    return unless auth

    # Either create a User record or update it based on the provider (Google) and the UID
    where(provider: auth.provider, uid: auth.uid, guest: false).first_or_create do |user|
      user.name = auth.info.name
      user.email = auth.info.email
      user.token = auth.credentials.token
      user.expires = auth.credentials.expires
      user.expires_at = auth.credentials.expires_at
      user.refresh_token = auth.credentials.refresh_token
    end
  end

  def as_json(*)
    super(only: [:id, :name, :email]).merge({
      gravatarUrl: gravatar_url,
      blobId: blob_id,
    })
  end

  def to_h(authenticated: false)
    json = as_json
    json["wsToken"] = ws_jwt if authenticated
    # json["jitsiJwt"] = jitsi_jwt if authenticated

    json
  end

  # See https://en.gravatar.com/site/implement/hash/
  def gravatar_url
    return unless email

    downcased_email = email.downcase
    gravatar_hash = Digest::MD5.hexdigest(downcased_email)
    "https://www.gravatar.com/avatar/#{gravatar_hash}"
  end

  def jitsi_jwt
    return unless group
    return if guest?

    pem = OpenSSL::PKey::RSA.new(ENV["JITSI_PEM"])

    payload = {
      aud: "jitsi",
      context: {
        user: {
          id: id.to_s,
          name: name,
          avatar: gravatar_url,
          moderator: "false",
        },
        features: {
          livestreaming: "false",
          recording: "false",
        },
      },
      exp: Time.now.to_i + (6 * 60 * 60), # 6 hours
      iss: "chat",
      nbf: Time.now.to_i - (2 * 60), # 2 minutes leeway in case of clock drift
      room: "*",
      sub: "vpaas-magic-cookie-cb5f846d50d54f4eb3ecfbdfc3875b94" # tenant ID
    }

    headers = {
      alg: "RS256",
      kid: "vpaas-magic-cookie-cb5f846d50d54f4eb3ecfbdfc3875b94/d250fc", # Key ID
      typ: "JWT",
    }

    JWT.encode(payload, pem, 'RS256', headers)
  end

  def send_user_channel_message(message)
    ActionCable.server.broadcast(websocket_key, message)
  end

  def websocket_key
    UserChannel.broadcasting_key(self.id)
  end

  RATE_LIMIT_INTERACTION_COUNT = 7
  RATE_LIMIT_MAX_TIME_PER_INTERACTION_COUNT = 2.seconds

  # Wraps an interaction in a user-scoped rate limit.
  # If the user has exceeded the rate limit, the block will not be yielded.
  def rate_limit(&block)
    last_five_interactions.unshift(Time.zone.now)

    if(last_five_interactions.length <= RATE_LIMIT_INTERACTION_COUNT)
      # Not rate limited, we haven't registered 5 total interactions yet
      save

      return yield
    end

    last_five_interactions.pop
    save

    if(last_five_interactions.first - last_five_interactions.last < RATE_LIMIT_MAX_TIME_PER_INTERACTION_COUNT)
      return :rate_limitted
    end

    yield
  end

  def ws_jwt
    pem = OpenSSL::PKey::RSA.new(ENV["WS_TOKEN_PEM"])

    payload = {
      aud: "socialspaces",
      exp: Time.now.to_i + (6 * 60 * 60), # 6 hours
      room: "*",
      sub: id.to_s
    }

    headers = {
      alg: "RS256",
      typ: "JWT",
    }

    JWT.encode(payload, pem, "RS256", headers)
  end

  def self.from_jwt(jwt)
    pem = OpenSSL::PKey::RSA.new(ENV["WS_TOKEN_PEM"])
    public_key = pem.public_key

    decoded_token = JWT.decode(jwt, public_key, true, { algorithm: "RS256" })

    User.find_by(id: decoded_token[0]["sub"]&.to_i)
  rescue JWT::VerificationError, JWT::DecodeError
    nil
  end

  def set_blob_id
    return unless group

    current_group_blob_ids = group.users.pluck(:blob_id)
    h = {}

    Group::NUMBER_OF_BLOBS.times do |i|
      h[i] = current_group_blob_ids.count { |id| id == i }
    end

    min_count = h.values.min
    blob_ids_with_min_count = h.select{ |k, v| v == min_count }.keys

    self.blob_id = blob_ids_with_min_count.sample
  end
end
