class DrawIt::EventHandler::Erase < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    instance.clear_draw_events

    send_websocket_message(instance, { erase: true, authorId: data["user_id"] })
  end
end
