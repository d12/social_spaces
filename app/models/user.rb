class User < ApplicationRecord
  has_many :activity_rooms, through: :room_membership

  def self.from_omniauth(auth)
    return unless auth&.info&.email && auth&.info&.name

    where(email: auth.info.email).first_or_create do |user|
      user.name = auth.info.name
    end
  end
end
