class ActivityChannel < ApplicationCable::Channel
  def subscribed
    stream_from broadcasting_key
  end

  def receive(data)
    response = instance.send_message(data)
    if response
      # TODO: This should send to a specific user
      ActionCable.server.broadcast(broadcasting_key, response)
    end
  end

  def unsubscribed
    puts "SOMEONE UNSUBSCRIBED AH SHIT"
    # Cleanup after someone unsubs
    # TODO: What triggers an unsub? What if they lose connectivity for a second? What if their laptop goes to sleep for a second?
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
