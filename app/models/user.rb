require "jwt"

class User < ApplicationRecord
  belongs_to :group, optional: true

  devise :omniauthable, :omniauth_providers => [:google_oauth2]

  encrypts :token
  encrypts :refresh_token

  def self.from_omniauth(auth)
    return unless auth

    # Either create a User record or update it based on the provider (Google) and the UID
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
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
      gravatarUrl: gravatar_url
    })
  end

  def to_h(authenticated: false)
    json = as_json
    json["jitsiJwt"] = jitsi_jwt if authenticated

    json
  end

  # See https://en.gravatar.com/site/implement/hash/
  def gravatar_url
    downcased_email = email.downcase
    gravatar_hash = Digest::MD5.hexdigest(downcased_email)
    "https://www.gravatar.com/avatar/#{gravatar_hash}"
  end

  def jitsi_jwt
    return unless group

    pem = OpenSSL::PKey::RSA.new(ENV["JITSI_PEM"])

    payload = {
      aud: "jitsi",
      context: {
        user: {
          id: id.to_s,
          name: name,
          avatar: gravatar_url,
          email: email,
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
end
