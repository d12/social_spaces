class DrawIt::EventHandlers::Erase < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    instance.draw_event_batches.delete_all

    send_websocket_message(instance, { erase: true, authorId: data["user_id"] })
  end
end
