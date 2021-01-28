class DrawIt::EventHandler::Draw < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    sleep 1

    data["draw_events"].each do |draw_event|
      instance.add_draw_event(draw_event)
    end

    send_websocket_message(instance, { drawEvents: data["draw_events"], authorId: data["user_id"] })
  end
end
