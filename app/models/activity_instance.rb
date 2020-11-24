class ActivityInstance < ApplicationRecord
  self.inheritance_column = "activity"

  before_create :initialize_storage

  belongs_to :group

  delegate :users, to: :group

  serialize :storage, IndifferentHashSerializer

  enum status: { awaiting_activity_thread: 0, ongoing: 1, finished: 2 }

  validate :ensure_minimum_players
  validate :ensure_maximum_players

  def as_json(*)
    self.class.as_json.merge({
      id: id
    })
  end

  def to_h
    as_json.to_h
  end

  def self.as_json(*)
    {
      displayName: display_name,
      maxUsers: max_users,
      name: name,
    }
  end

  def self.to_h
    as_json.to_h
  end

  def self.display_name
    raise NotImplementedError
  end

  def self.min_users
    raise NotImplentedError
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

  def disconnect_user(user)
    return unless users.include?(user)

    user.update(group_id: nil)

    # TODO: Make sure the error we get is "not enough players"
    if save
      process_message({event: "user_disconnected", user: user.id})
    else
      # TODO: Tell people why the game is being destroyed
      self.end_activity(reason: :not_enough_players)
    end
  end

  def end_activity(reason:)
    broadcast_activity_end_message(reason: reason)
    destroy
  end

  private

  def ensure_minimum_players
    if users.count < self.class.min_users
      errors.add(:activity, "cannot be played with less than #{self.class.min_users} users")
    end
  end

  def ensure_maximum_players
    if users.count > self.class.max_users
      errors.add(:activity, "cannot be played with more than #{self.class.max_users} users")
    end
  end

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

  def broadcast_activity_end_message(reason:)
    ActivityChannel.broadcast_activity_end_message(self, reason: reason)
  end
end
