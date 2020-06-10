class Group < ApplicationRecord
  has_many :group_memberships
  has_many :users, through: :group_memberships

  before_validation :generate_key_if_missing
  validates :key, presence: true, uniqueness: true

  private

  def generate_key_if_missing
    return if self.key

    # Generates a random string from a set of easily readable characters
    charset = %w{ 2 3 4 6 7 9 A C D E F G H J K M N P Q R T V W X Y Z}
    self.key = 6.times.map { charset.to_a[rand(charset.size)] }.join
  end
end
