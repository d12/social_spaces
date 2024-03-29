class ActivityInstance < ApplicationRecord
  self.inheritance_column = "activity"

  before_create :initialize_storage

  before_save :increment_storage_version, if: :will_save_change_to_storage?

  belongs_to :group

  delegate :users, to: :group

  serialize :storage, IndifferentHashSerializer

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
      description: description,
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

  def self.description
    raise NotImplementedError
  end

  def self.min_users
    raise NotImplentedError
  end

  def self.max_users
    raise NotImplementedError
  end

  # All the data required for a client to set its local state
  # Note that this data is global and sent to all users.
  # For user-specific data, use #user_data
  def game_state
    # Transform keys to camelCase as JS will expect
    storage.deep_transform_keys{ |k| k.camelcase(:lower) }
  end

  # Used by the game loop. Not currently in use.
  def tick
    raise NotImplementedError
  end

  def user_data(user)
    raise NotImplementedError
  end

  def process_message(data)
    number_of_connected_users = storage[:users].count {|u| !u[:disconnected] }
    if(number_of_connected_users < self.class.min_users)
      end_activity(reason: :not_enough_players)
      return
    end

    event = data.delete(:event)
    handler = event_handlers[event]

    unless handler
      raise "#{self.class.name} does not implement a handler for event #{event}"
    end

    with_lock do
      handler.new(instance: self).call(data)
    end
  end

  def disconnect_user(user)
    if valid?
      process_message({event: "user_disconnected", user: user.id})
    else
      self.end_activity(reason: :not_enough_players)
    end
  end

  def end_activity(reason:)
    broadcast_activity_end_message(reason: reason)
    destroy
  end

  def send_activity_channel_message(message)
    ActionCable.server.broadcast(websocket_key, message)
  end

  def websocket_key
    ActivityChannel.broadcasting_key(self.id)
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
    GroupChannel.broadcast_activity_end_message(group, reason: reason)
  end

  def increment_storage_version
    storage[:version] ||= 0
    storage[:version] += 1
  end
end
