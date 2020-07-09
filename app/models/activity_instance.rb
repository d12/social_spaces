class ActivityInstance < ApplicationRecord
  self.inheritance_column = "activity"

  before_create :initialize_storage

  belongs_to :group

  delegate :users, to: :group

  serialize :storage, IndifferentHashSerializer

  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }

  def self.to_json
    super(only: [:display_name, :max_users, :name])
  end

  def self.display_name
    raise NotImplementedError
  end

  def self.max_users
    raise NotImplementedError
  end

  # Called when a client sends a message to the game server.
  # Data is an arbitrary JSON hash.
  def process_message(data)
    raise NotImplementedError
  end

  # When a client is loaded into an activity midway, they need
  # enough data to be able to properly bootstrap themselves. Return any necessary data here.
  def client_data
    raise NotImplementedError
  end

  # Used by the game loop. Not currently in use.
  def tick
    raise NotImplementedError
  end

  private

  def initialize_storage
    self.storage = initial_storage
  end

  # The initial state stored in the database for a new activity instance.
  def initial_storage
    raise NotImplementedError
  end
end
