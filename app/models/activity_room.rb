class ActivityRoom < ApplicationRecord
  validates :activity_slug, presence: true
  validates :video_call_id, uniqueness: true
end
