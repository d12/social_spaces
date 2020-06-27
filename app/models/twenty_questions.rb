class TwentyQuestions < ActivityInstance
  class Event
    SELECT_WORD = "select_word"
    ASKED_QUESTION = "asked_question"
  end

  class Status
    SELECTING_WORD = :selecting_word # The leader is selecting a word
    ASKING_QUESTIONS = :asking_questions # The others are asking yes/no questions
  end

  WORDS = %w[
    airpods
    piano
    sunglasses
    salt
    bike
    cat
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
    data = case state[:status].to_sym
    when Status::SELECTING_WORD
      state.slice(:status, :leader_index, :word_options, :users)
    when Status::ASKING_QUESTIONS
      state.slice(:status, :leader_index, :word, :asker_index, :question_index, :users)
    end

    # Transform keys to camelCase as JS will expect
    data.transform_keys{ |k| k.camelcase(:lower) }
  end

  # The initial value to use for a instances save state
  def initial_state
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
      question_index: nil                  # Which question # are we asking now?
    }
  end

  private

  def select_word_event(data)
    state[:word] = data[:word]
    state[:status] = Status::ASKING_QUESTIONS
    state[:question_index] = 1

    set_next_asker

    if state[:asker_index] == state[:leader_index]
      set_next_asker
    end
  end

  def set_next_asker
    if state[:asker_index]
      state[:asker_index] = (state[:asker_index] + 1) % state[:users].length
    else
      state[:asker_index] = 1
    end

    if state[:asker_index] == state[:leader_index]
      set_next_asker
    end
  end

  def set_next_leader
    state[:leader_index] = (state[:leader_index] + 1) % state[:users].length

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
    if state[:question_index] == 20
      game_over
      return
    end

    state[:question_index] += 1
    set_next_asker
  end

  def process_correct_answer
    # TELL PEOPLE THEY GOT THE CORRECT ANSWER
    finish_game
  end

  def game_over
    # TELL PEOPLE THEY GOT A GAME OVER, ASK THE LEADER TO TELL THE OTHERS WHAT THE WORD WAS
    finish_game
  end

  def finish_game
    set_next_leader
    state[:status] = Status::SELECTING_WORD
    state[:word] = nil
    state[:word_options] = WORDS.sample(3)
  end
end
