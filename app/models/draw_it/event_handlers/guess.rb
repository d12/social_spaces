class DrawIt::EventHandlers::Guess < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user = storage[:users].find{|u| u[:id] == data["user_id"]}
    return if user[:has_guessed_current_word]

    if(data["message"].downcase == storage[:chosen_word])
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

    if(storage[:users].count{ |u| u[:has_guessed_current_word] } == storage[:users].count - 1)
      next_turn
    end

    send_gamestate_to_all(instance)
  end

  private

  def next_turn
    storage[:drawing_user_index] = (storage[:drawing_user_index] + 1) % storage[:users].count
    if(storage[:drawing_user_index] == 0)
      storage[:round_number] += 1
    end

    storage[:users].each do |u|
      u[:has_guessed_current_word] = false
    end

    storage[:words_to_choose] = DrawIt::WORDS.sample(3)
    storage[:given_letters] = storage[:chosen_word]
    storage[:status] = "choosing"
  end

  def storage
    instance.storage
  end
end