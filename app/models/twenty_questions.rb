class TwentyQuestions < ActivityInstance
  WORDS = [
    "airpods",
    "piano",
    "sunglasses",
    "salt",
    "bike",
    "cat"
  ]

  def self.display_name
    "Twenty Questions"
  end

  def self.max_users
    8
  end

  def message(data)
    puts "Got a message: #{data}"
    case data["action"]
    when "select_word"
      puts "Selected #{data["word"]}"
    end
  end

  def tick

  end

  # All the data required for a client to bootstrap itself
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_bootstrap_data
    case state[:status].to_sym
    when :selecting_word
      state.slice(:status, :leader, :word_options)
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
      status: :selecting_word,
      word: nil,
      word_options: WORDS.sample(3),
      leader: users_array.first[:user_id],
      users: users_array
    }
  end
end
