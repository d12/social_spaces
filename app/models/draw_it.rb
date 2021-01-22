class DrawIt < ActivityInstance
  register_event "draw", EventHandlers::Draw
  register_event "user_joined", EventHandlers::UserJoined
  register_event "user_disconnected", EventHandlers::UserDisconnected
  register_event "erase", EventHandlers::Erase
  register_event "select_word", EventHandlers::SelectWord
  register_event "guess", EventHandlers::Guess

  WORDS = File.readlines("db/data/draw_it_words.txt", chomp: true).uniq
  ROUND_LENGTH = 30.seconds
  TIME_BETWEEN_REVEALS = 10.seconds

  # Note we're delete_all'ing here for perf. This skips callbacks, so be careful there.
  has_many :draw_event_batches, class_name: "DrawIt::DrawEventBatch", foreign_key: "activity_instance_id", dependent: :delete_all

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
    8
  end

  def tick
    puts "tock"

    check_time_til_round_end
    check_time_til_letter_reveal

    save
  end

  def client_data
    storage.slice(
      :users,
      :status,
      :drawing_user_index,
      :words_to_choose,
      :given_letters,
      :round_number
    ).merge({
      "time_til_round_end" => time_til_round_end
    }).deep_transform_keys { |k|
       k.camelcase(:lower)
    }
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name,
        score: 0,
        has_guessed_current_word: false,
      }
    end

    {
      status: "choosing",
      words_to_choose: WORDS.sample(3),
      chosen_word: nil,
      drawing_user_index: 0,
      users: users_array,
      given_letters: nil,
      round_number: 1,
      round_expire_time: nil,
      letter_reveal_time: nil,
    }
  end

  private

  def time_til_round_end
    return unless storage[:round_expire_time]

    (Time.at(storage[:round_expire_time]) - Time.now).to_i
  end

  def check_time_til_round_end
    if time_til_round_end&.negative? && storage[:status] == "drawing"
      EventHandlers::OutOfTime.new(instance: self).call({})
    end
  end

  def time_til_letter_reveal
    return unless storage[:letter_reveal_time]
    (Time.at(storage[:letter_reveal_time]) - Time.now).to_i
  end

  def check_time_til_letter_reveal
    if time_til_letter_reveal&.negative? && storage[:status] == "drawing"
      EventHandlers::RevealLetter.new(instance: self).call({})
    end
  end
end
