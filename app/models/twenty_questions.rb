class TwentyQuestions < ActivityInstance
  class Event
    SELECT_WORD = :select_word_event
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

    case data[:word]
    when Event::SELECT_WORD
      select_word_event(data)
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
    case state[:status].to_sym
    when Status::SELECTING_WORD
      state.slice(:status, :leader, :word_options)
    when Status::ASKING_QUESTIONS
      state.slice(:status, :leader, :word, :current_player, :question_index)
    end
  end

  # The initial value to use for a instances save state
  def initial_state
    users_array = users.map do |user|
      {
        user_id: user.id
      }
    end

    {
      status: Status::SELECTING_WORD,
      word: nil,                           # The current word being guessed
      word_options: WORDS.sample(3),       # The word options for the leader to pick from
      leader: users_array.first[:user_id], # The current leader
      users: users_array,                  # The users in the game
      current_player: nil,                 # The current player asking a question
      question_index: nil                  # Which question # are we asking now?
    }
  end

  private

  def select_word_event(data)
    state[:word] = data[:word]
    state[:status] = Status::ASKING_QUESTIONS
    state[:current_player] = state[:users].first[:user_id]
    state[:question_index] = 1
  end
end
