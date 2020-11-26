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
    @group = Group.find_by(key: params[:group_id])
    stream_for @group
  end
end
