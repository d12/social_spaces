class GroupChannel < ApplicationCable::Channel
  def self.broadcast_user_joined(group, user)
    broadcast_to(group, { type: 'JOINED', user: user.as_json })
  end

  def self.broadcast_user_left(group, user)
    broadcast_to(group, { type: 'LEFT', user: user.as_json })
  end

  def self.broadcast_activity_started(group)
    broadcast_to(group, { type: 'ACTIVITY_START' })
  end

  # Callbacks
  def subscribed
    @group = Group.find_by(key: params[:group_id])
    stream_for @group
  end
end
