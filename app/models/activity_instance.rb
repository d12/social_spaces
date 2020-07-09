class ActivityInstance < ApplicationRecord
  self.inheritance_column = "activity"

  before_create :initialize_storage

  belongs_to :group

  delegate :users, to: :group

  serialize :storage, IndifferentHashSerializer

  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }

  def self.as_json(*)
    {displayName: display_name, maxUsers: max_users, name: name}
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

  # All the data required for a client to set its local state
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_data
    # Transform keys to camelCase as JS will expect
    storage.transform_keys{ |k| k.camelcase(:lower) }
  end

  # Used by the game loop. Not currently in use.
  def tick
    raise NotImplementedError
  end

  def process_message(data)
    event = data.delete(:event)
    handler = event_handlers[event]

    unless handler
      raise "#{self.name} does not implement a handler for event #{event}"
    end

    handler.new(instance: self).call(data)

    save!
    client_data
  end

  private

  def event_handlers
    self.class.event_handlers
  end

  def self.event_handlers
    @event_handlers
  end

  def self.register_event(key, handler)
    @event_handlers ||= {}
    @event_handlers[key] = handler
  end

  def initialize_storage
    self.storage = initial_storage
  end

  # The initial state stored in the database for a new activity instance.
  def initial_storage
    raise NotImplementedError
  end
end
