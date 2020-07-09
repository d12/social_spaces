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
    super(only: [:id, :name])
  end
end
