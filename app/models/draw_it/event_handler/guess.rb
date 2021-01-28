class DrawIt::EventHandler::Guess < EventHandler
  include DrawIt::EventHandlerHelper

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
        user[:score] += score_for_correct_guess

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

      if(storage[:users].none?{ |u| !u[:has_guessed_current_word] && !u[:disconnected] && !(u[:id] == storage[:users][storage[:drawing_user_index]][:id]) })
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

  def ratio_of_time_left_to_total_time
    (instance.time_til_round_end * 1.0) / DrawIt::ROUND_LENGTH
  end

  # -10 / +10 stuff ensures you will always get at least 10 points for guessing correct
  def score_for_correct_guess
    ((DrawIt::MAXIMUM_POINTS_PER_GUESS - 10) * ratio_of_time_left_to_total_time).round(-1) + 10 # Round to 10s
  end
end
