require "google_api"

class Group < ApplicationRecord
  has_many :group_memberships
  has_many :users, through: :group_memberships

  before_validation :generate_key_if_missing, :generate_hangout_link
  before_save :generate_hangout_link

  validates :key, presence: true, uniqueness: true

  def host
    host_membership = group_memberships.find_by(host: true)
    return host_membership.user if host_membership

    # If no host, appoint a new host
    membership = group_memberships.first
    return unless membership

    membership.update(host: true)
    membership.user
  end

  private

  def generate_hangout_link
    self.meet_url = GoogleAPI.generate_meet_url(users.first)
  end

  def generate_key_if_missing
    return if self.key

    # Generates a random string from a set of easily readable characters
    charset = %w{ 2 3 4 6 7 9 A C D E F G H J K M N P Q R T V W X Y Z}
    self.key = 6.times.map { charset.to_a[rand(charset.size)] }.join
  end
end
