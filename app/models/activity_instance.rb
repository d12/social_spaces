class ActivityInstance < ApplicationRecord
  self.inheritance_column = "activity"

  belongs_to :group
  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }

  before_create :initialize_storage

  def self.display_name
    "Twenty Questions"
  end

  def self.max_users
    8
  end

  def message(data)
    raise NotImplementedError
  end

  def client_bootstrap_data
    raise NotImplementedError
  end

  def tick
    raise NotImplementedError
  end

  private

  def initialize_storage
    self.state ||= initial_state
  end

  def initial_state
    raise NotImplementedError
  end
end
