class DrawIt::EventHandlers::Draw < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    data["draw_events"].each do |event|
      DrawIt::DrawEvent.create(activity_instance: instance, draw_data: event)
    end

    send_websocket_message(instance, { drawEvents: data["draw_events"], authorId: data["user_id"] })
  end

  private

  def storage
    instance.storage
  end
end
