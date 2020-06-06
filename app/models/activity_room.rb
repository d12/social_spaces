class ActivityRoom < ApplicationRecord
  has_many :users, through: :room_membership
  belongs_to :video_call, required: false

  validates :activity_slug, presence: true
  validates :video_call_id, uniqueness: true
end
