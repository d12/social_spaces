class DrawIt::EventHandlers::Draw < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    storage[:draw_events] += data["draw_events"]
    send_websocket_message(instance, { drawEvents: data["draw_events"], authorId: data["user_id"] })
  end

  private

  def storage
    instance.storage
  end
end
