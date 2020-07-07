class TwentyQuestions < ActivityInstance
  class Event
    SELECT_WORD = "select_word"
    ASKED_QUESTION = "asked_question"
    BEGIN_NEXT_ROUND = "begin_next_round"
  end

  class Status
    SELECTING_WORD = :selecting_word     # The leader is selecting a word
    ASKING_QUESTIONS = :asking_questions # The others are asking yes/no questions
    ROUND_END = :round_end               # Game-over transition state before next round
  end

  WORDS = %w[
    airpods
    piano
    sunglasses
    salt
    bike
    cat
    phone
    umbrella
  ]

  def self.display_name
    "Twenty Questions"
  end

  def self.max_users
    8
  end

  def process_message(data)
    puts "Got a message: #{data}"

    case data[:event]
    when Event::SELECT_WORD
      select_word_event(data)
    when Event::ASKED_QUESTION
      asked_question_event(data)
    when Event::BEGIN_NEXT_ROUND
      begin_next_round_event
    end

    save!
    client_data
  end

  def tick
  end

  # All the data required for a client to set its local state
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_data
    data = case storage[:status].to_sym
    when Status::SELECTING_WORD
      storage.slice(:status, :leader_index, :word_options, :users)
    when Status::ASKING_QUESTIONS
      storage.slice(:status, :leader_index, :word, :asker_index, :question_index, :users)
    when Status::ROUND_END
      storage.slice(:status, :leader_index, :word, :users, :round_end_state)
    end

    # Transform keys to camelCase as JS will expect
    data.transform_keys{ |k| k.camelcase(:lower) }
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name
      }
    end

    {
      status: Status::SELECTING_WORD,
      word: nil,                           # The current word being guessed
      word_options: WORDS.sample(3),       # The word options for the leader to pick from
      leader_index: 0,                     # The index of thecurrent leader in the users list
      users: users_array,                  # The users in the game
      asker_index: nil,                    # The current player asking a question
      question_index: nil,                 # Which question # are we asking now?
      round_end_state: nil                 # 'win' or 'lose', used at end of game
    }
  end

  private

  def select_word_event(data)
    storage[:word] = data[:word]
    storage[:status] = Status::ASKING_QUESTIONS
    storage[:question_index] = 1

    set_next_asker
  end

  def set_next_asker
    if storage[:asker_index]
      storage[:asker_index] = (storage[:asker_index] + 1) % storage[:users].length
    else
      storage[:asker_index] = 1
    end

    if storage[:asker_index] == storage[:leader_index]
      set_next_asker
    end
  end

  def set_next_leader
    storage[:leader_index] = (storage[:leader_index] + 1) % storage[:users].length

    set_next_asker
  end

  def asked_question_event(data)
    case data[:result]
    when "yes", "no"
      process_yes_no
    when "correctanswer"
      process_correct_answer
    else
      puts "Unknown result!"
    end
  end

  def process_yes_no
    if storage[:question_index] == 20
      game_over
      return
    end

    storage[:question_index] += 1
    set_next_asker
  end

  def process_correct_answer
    storage[:round_end_state] = "win"
    storage[:status] = Status::ROUND_END
  end

  def game_over
    storage[:round_end_state] = "lose"
    storage[:status] = Status::ROUND_END
  end

  def begin_next_round_event
    set_next_leader
    storage[:status] = Status::SELECTING_WORD
    storage[:word] = nil
    storage[:word_options] = WORDS.sample(3)
  end
end
