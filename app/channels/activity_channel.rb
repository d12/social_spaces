class ActivityChannel < ApplicationCable::Channel
  def subscribed
    stream_from broadcasting_key

    ActionCable.server.broadcast(broadcasting_key, {gameState: instance.game_state})
  end

  def receive(data)
    response = instance.reload.process_message(data.deep_transform_keys(&:underscore).with_indifferent_access)
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
