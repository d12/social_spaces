class User < ApplicationRecord
  has_many :group_memberships
  has_many :groups, through: :group_memberships

  def self.from_omniauth(auth)
    return unless auth&.info&.email && auth&.info&.name

    where(email: auth.info.email).first_or_create do |user|
      user.name = auth.info.name
    end
  end
end
