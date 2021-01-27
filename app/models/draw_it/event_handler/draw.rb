class DrawIt::EventHandler::Draw < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    DrawIt::DrawEventBatch.create(activity_instance: instance, draw_data: data["draw_events"])

    send_websocket_message(instance, { drawEvents: data["draw_events"], authorId: data["user_id"] })
  end
end
