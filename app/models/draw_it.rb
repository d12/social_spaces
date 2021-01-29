class DrawIt < ActivityInstance
  register_event "draw", EventHandler::Draw
  register_event "user_joined", EventHandler::UserJoined
  register_event "user_disconnected", EventHandler::UserDisconnected
  register_event "erase", EventHandler::Erase
  register_event "select_word", EventHandler::SelectWord
  register_event "guess", EventHandler::Guess

  WORDS_HASH = JSON.parse(File.read("db/data/draw_it_words.json"))
  ROUND_LENGTH = 60.seconds

  # The maximum amount of word to reveal over the duration of the round.
  AMOUNT_OF_WORD_TO_REVEAL = 0.5
  TIME_BETWEEN_REVEAL_CHECKS = 5.seconds

  MAXIMUM_POINTS_PER_GUESS = 200

  class Status
    DRAWING = :drawing
  end

  def self.display_name
    "Draw It"
  end

  def self.description
    "It's literally Skribbl.io"
  end

  def self.min_users
    2
  end

  def self.max_users
    128
  end

  def tick
    check_time_til_round_end
    check_time_til_letter_reveal

    save
  end

  def game_state
    storage.slice(
      :users,
      :status,
      :drawing_user_index,
      :words_to_choose,
      :given_letters,
      :round_number,
      :ran_out_of_time,
      :version,
    ).merge({
      "time_til_round_end" => time_til_round_end
    }).deep_transform_keys { |k|
       k.camelcase(:lower)
    }
  end

  def user_data(user)
    data = {
      drawEvents: draw_events
    }

    if(storage[:users][storage[:drawing_user_index]][:id] == user.id)
      data[:wordForDrawer] = storage[:chosen_word]
    end

    data
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name,
        score: 0,
        has_guessed_current_word: false,
        disconnected: false
      }
    end

    {
      status: "choosing",
      words_to_choose: WORDS_HASH["medium"].sample(3), # TODO, once we have a config step, this should init to nil
      chosen_word: nil,
      drawing_user_index: 0,
      users: users_array,
      given_letters: nil,
      round_number: 1,
      round_expire_time: nil,
      letter_reveal_time: nil,
      ran_out_of_time: false,
      version: 0,
      difficulty: "medium", # TODO, once we have a config step, this should init to nil
      chosen_words: []
    }
  end

  def add_draw_event(event)
    Redis.current.rpush(draw_events_redis_key, event.to_s)
  end

  def clear_draw_events
    Redis.current.del(draw_events_redis_key)
  end

  def draw_events
    Redis.current.lrange(draw_events_redis_key, 0, -1).map{ |v| JSON.parse(v) }
  end

  def time_til_round_end
    return unless storage[:round_expire_time]

    (Time.at(storage[:round_expire_time]) - Time.now).to_i
  end

  private

  def draw_events_redis_key
    "activity-draw-it-draw-events-#{id}"
  end

  def check_time_til_round_end
    if time_til_round_end&.<=(0) && storage[:status] == "drawing"
      EventHandler::OutOfTime.new(instance: self).call({})
    end
  end

  def time_til_letter_reveal
    return unless storage[:letter_reveal_time]
    (Time.at(storage[:letter_reveal_time]) - Time.now).to_i
  end

  def check_time_til_letter_reveal
    if time_til_letter_reveal&.<=(0) && storage[:status] == "drawing"
      EventHandler::RevealLetter.new(instance: self).call({})
    end
  end
end
