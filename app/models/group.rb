require "google_api"

class Group < ApplicationRecord
  has_many :users

  validates :users, :presence => true

  before_validation :generate_key_if_missing, :generate_hangout_link
  before_save :generate_hangout_link

  before_create :set_host

  validates :key, presence: true, uniqueness: true

  def host
    if self.host_id
      return User.find(self.host_id)
    end

    new_host = users.first
    return unless new_host

    update!(host_id: new_host.id)
    new_host
  end

  private

  def set_host
    if users.any?
      self.host_id = users.first.id
    end
  end

  def generate_hangout_link
    if users.any?
      self.meet_url = GoogleAPI.generate_meet_url(users.first)
    end
  end

  def generate_key_if_missing
    return if self.key

    # Generates a random string from a set of easily readable characters
    charset = %w{ 2 3 4 6 7 9 A C D E F G H J K M N P Q R T V W X Y Z}
    self.key = 6.times.map { charset.to_a[rand(charset.size)] }.join
  end
end
