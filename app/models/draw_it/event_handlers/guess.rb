class DrawIt::EventHandlers::Guess < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    if(data["message"].downcase == storage[:chosen_word])
      user = storage[:users].find{|u| u[:id] == data["user_id"]}
      user[:has_guessed_current_word] = true

      send_websocket_message(instance, {
        chatMessage: { author: data["user_name"], content: "#{data['user_name']} guessed the word.", correct: true },
        authorId: data["user_id"]
      })
    else
      send_websocket_message(instance, {
        chatMessage: { author: data["user_name"], content: data["message"], correct: false },
        authorId: data["user_id"]
      })
    end
  end

  private

  def storage
    instance.storage
  end
end
