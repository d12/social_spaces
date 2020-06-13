class ActivityInstance < ApplicationRecord
  belongs_to :group
  enum status: { awaiting_game_thread: 0, ongoing: 1, finished: 2 }
  validate :ensure_activity_state_data_is_json

  private

  def ensure_activity_state_data_is_json
    return unless activity_state_data
    JSON.parse(activity_state_data.to_s)
  rescue JSON::ParserError => e
    errors.add(:activity_state_data, "must be valid JSON")
  end
end
