class User < ApplicationRecord
  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.name = auth.info.name
    end
  end
end
