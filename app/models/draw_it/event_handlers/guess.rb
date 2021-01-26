class DrawIt::EventHandlers::Guess < EventHandler
  attr_reader :instance

  MESSAGE_LENGTH_LIMIT = 400

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    return if data["message"].length > MESSAGE_LENGTH_LIMIT

    ar_user = User.find(data["user_id"])
    result = ar_user.rate_limit do
      user = storage[:users].find{|u| u[:id] == data["user_id"]}

      if(storage[:status] == "drawing" && (user[:has_guessed_current_word] || storage[:users][storage[:drawing_user_index]][:id] == user[:id]))
        send_websocket_message(instance, {
          chatMessage: { author: data["user_name"], content: data["message"], type: "winnersmessage" },
          authorId: data["user_id"]
        })
      elsif(storage[:status] == "drawing" && (data["message"].downcase == storage[:chosen_word].downcase))
        user[:has_guessed_current_word] = true
        user[:score] += (11 - correct_players_count)

        send_websocket_message(instance, {
          chatMessage: { content: "#{data['user_name']} guessed the word.", type: "correct" },
          authorId: data["user_id"]
        })
      else
        send_websocket_message(instance, {
          chatMessage: { author: data["user_name"], content: data["message"], type: "guess" },
          authorId: data["user_id"]
        })
      end

      if(storage[:users].count{ |u| u[:has_guessed_current_word] } == storage[:users].count - 1)
        next_turn
      end

      instance.save!
      send_gamestate_to_all(instance)
    end

    if(result == :rate_limitted)
      send_websocket_message(ar_user, {
        chatMessage: { content: "Calm yo tits.", type: "ratelimit" }
      })
    end
  end

  private

  def next_turn
    give_points_to_drawer

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

  def give_points_to_drawer
    storage[:users][storage[:drawing_user_index]][:score] += (correct_players_count * storage[:chosen_word].length)
  end

  def correct_players_count
    storage[:users].count{|u| u[:has_guessed_current_word]}
  end

  def storage
    instance.storage
  end
end
