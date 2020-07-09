class ActivityChannel < ApplicationCable::Channel
  def subscribed
    stream_from broadcasting_key
  end

  def receive(data)
    response = instance.reload.process_message(data.with_indifferent_access.transform_keys(&:underscore))
    if response
      ActionCable.server.broadcast(broadcasting_key, {gameState: response})
    end
  end

  def unsubscribed
    puts "SOMEONE UNSUBSCRIBED AH SHIT"
    # Cleanup after someone unsubs
    # TODO: What triggers an unsub? What if they lose connectivity for a second? What if their laptop goes to sleep for a second?
  end

  def self.broadcast_activity_end_message(instance)
    ActionCable.server.broadcast(broadcasting_key(instance.id), { event: "ACTIVITY_END" })
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
