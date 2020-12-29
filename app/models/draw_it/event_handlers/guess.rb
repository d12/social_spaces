class DrawIt::EventHandlers::Guess < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    send_websocket_message(instance, { chatMessage: { author: data["user_name"], content: data["message"] }, authorId: data["user_id"] })
  end
end
