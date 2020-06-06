class VideoCall < ApplicationRecord
  has_one :activity_room, required: false

  validates :url, presence: true
  validates :timeout_in_days, presence: true

  def activity_room
    ActivityRoom.find_by(video_call_id: id)
  end
end
