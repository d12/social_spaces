class Group < ApplicationRecord
  has_many :users

  validates :users, :presence => true

  before_validation :generate_key_if_missing

  before_create :set_host

  validates :key, presence: true, uniqueness: true

  has_one :activity_instance
  alias_attribute :activity, :activity_instance

  def host
    if self.host_id
      return User.find(self.host_id)
    end

    new_host = users.first
    return unless new_host

    update!(host_id: new_host.id)
    new_host
  end

  def as_json(*)
    obj = super(only: [:key, :host_id]).merge({
      users: users.map(&:to_h),
    })

    obj[:activity] = activity.as_json if activity

    obj.deep_transform_keys{ |key| key.to_s.camelcase(:lower) }
  end

  def to_h
    as_json.to_h
  end

  private

  def set_host
    if users.any?
      self.host_id = users.first.id
    end
  end

  def generate_key_if_missing
    return if self.key

    # Generates a random string from a set of easily readable characters
    charset = %w{ 2 3 4 6 7 9 A C D E F G H J K M N P Q R T V W X Y Z}
    self.key = 6.times.map { charset.to_a[rand(charset.size)] }.join
  end
end
