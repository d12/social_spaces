class DrawIt::EventHandlers::UserJoined < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    send_websocket_message(User.find(data[:user_id]), { drawEvents: instance.storage[:draw_events] })
    send_gamestate_to_all(instance)
  end

  private

  def storage
    instance.storage
  end
end
