class DrawIt::EventHandlers::UserJoined < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    send_websocket_message(User.find(data[:user_id]), { drawEvents: draw_events })
    send_gamestate_to_all(instance)
  end

  private

  def draw_events
    instance.draw_events.order(:created_at).pluck(:draw_data)
  end

  def storage
    instance.storage
  end
end
