class ActivityChannel < ApplicationCable::Channel
  def subscribed
    current_user.update(disconnected_at: nil)

    stream_from broadcasting_key
  end

  def receive(data)
    response = instance.reload.process_message(data.with_indifferent_access.transform_keys(&:underscore))
    if response
      ActionCable.server.broadcast(broadcasting_key, {gameState: response})
    end
  end

  def unsubscribed
    current_user.update(disconnected_at: Time.zone.now)
  end

  def self.broadcast_activity_end_message(instance, reason:)
    ActionCable.server.broadcast(broadcasting_key(instance.id), { event: "ACTIVITY_END", message: reason })
  end

  private

  def instance
    @activity ||= ActivityInstance.find(params[:activity_instance_id])
  end

  def broadcasting_key
    "activity_#{params[:activity_instance_id]}"
  end

  def self.broadcasting_key(activity_instance_id)
    "activity_#{activity_instance_id}"
  end
end
