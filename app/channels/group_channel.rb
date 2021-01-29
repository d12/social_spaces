class GroupChannel < ApplicationCable::Channel
  def self.broadcast_user_joined(group)
    broadcast_to(group, { type: "JOINED" })
  end

  def self.broadcast_user_left(group)
    broadcast_to(group, { type: "LEFT" })
  end

  def self.broadcast_activity_started(group)
    broadcast_to(group, { type: 'ACTIVITY_START' })
  end

  def self.broadcast_activity_end_message(group, reason:)
    broadcast_to(group, { type:  "ACTIVITY_END", reason: reason })
  end

  # Callbacks
  def subscribed
    current_user.update(disconnected_at: nil)
    @group = Group.find_by(key: params[:group_id])
    stream_for @group

    add_connection_for_user(current_user.id)
  end

  def unsubscribed
    remove_connection_for_user(current_user.id)

    if(no_remaining_connections_for_user?(current_user.id))
      current_user.update(disconnected_at: Time.zone.now)
    end
  end

  private

  def add_connection_for_user(user_id)
    Redis.current.incr(connection_count_redis_key(user_id))
  end

  def remove_connection_for_user(user_id)
    connection_count = connection_count_for_user(user_id).to_i

    if connection_count <= 1
      Redis.current.del(connection_count_redis_key(user_id))
    else
      Redis.current.decr(connection_count_redis_key(user_id))
    end
  end

  def no_remaining_connections_for_user?(user_id)
    connection_count_for_user(user_id) == "0"
  end

  def connection_count_for_user(user_id)
    Redis.current.get(connection_count_redis_key(user_id)) || "0"
  end

  def connection_count_redis_key(user_id)
    "group_channel_connections_for_user_#{user_id}"
  end
end
