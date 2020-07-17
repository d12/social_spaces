class TwentyQuestions < ActivityInstance
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

  register_event "select_word", TwentyQuestions::EventHandlers::SelectWord
  register_event "asked_question", TwentyQuestions::EventHandlers::AskedQuestion
  register_event "begin_next_round", TwentyQuestions::EventHandlers::BeginNextRound
  register_event "user_disconnected", TwentyQuestions::EventHandlers::UserDisconnected

  def self.display_name
    "Twenty Questions"
  end

  def self.min_users
    2
  end

  def self.max_users
    8
  end

  def tick
    puts "tock"
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
end
