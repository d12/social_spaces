class Group < ApplicationRecord
  NUMBER_OF_BLOBS = 5

  has_many :users, -> { order(joined_group_at: :asc) }

  validates :users, :presence => true

  before_validation :generate_key_if_missing

  before_create :initialize_host

  validates :key, presence: true, uniqueness: true

  has_one :activity_instance
  alias_attribute :activity, :activity_instance

  def remove_user(user)
    user.update(group_id: nil)
    if host_id == user.id
      set_new_host
    end

    if users.reload.any?
      GroupChannel.broadcast_user_left(self)
    else
      activity&.destroy
      destroy
    end
  end

  def add_user(user)
    user.update!(group_id: id, joined_group_at: Time.now, blob_id: generate_blob_id)

    GroupChannel.broadcast_user_joined(self)
  end

  def host
    User.find_by(id: host_id)
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

  def initialize_host
    self.host_id = users.first.id
  end

  def set_new_host
    if users.any?
      update(host_id: users.first.id)
    end
  end

  def generate_key_if_missing
    return if self.key

    # Generates a random string from a set of easily readable characters
    charset = %w{ 2 3 4 6 7 9 A C D E F G H J K M N P Q R T V W X Y Z}
    self.key = 6.times.map { charset.to_a[rand(charset.size)] }.join
  end

  def generate_blob_id
    current_group_blob_ids = users.pluck(:blob_id)
    h = {}

    NUMBER_OF_BLOBS.times do |i|
      h[i] = current_group_blob_ids.count { |id| id == i }
    end

    min_count = h.values.min
    blob_ids_with_min_count = h.select{ |k, v| v == min_count }.keys

    blob_ids_with_min_count.sample
  end
end
