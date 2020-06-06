class VideoCall < ApplicationRecord
  validates :url, presence: true
  validates :timeout_in_days, presence: true

  def activity_room
    ActivityRoom.find_by(video_call_id: id)
  end
end
