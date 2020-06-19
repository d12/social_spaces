class ActivityInstance < ApplicationRecord
  belongs_to :group
  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }
end
