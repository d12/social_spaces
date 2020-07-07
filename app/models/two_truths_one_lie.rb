class TwoTruthsOneLie < ActivityInstance
  class Event
    ENTERED_STATEMENTS = "entered_statements"
    VOTED = "voted"
    INITATED_NEXT_TURN = "initiated_next_turn"
    INITIATED_NEXT_ROUND = "initated_next_round"
  end

  class Status
    BRAINSTORMING = :brainstorming # Users are entering statements
    VOTING = :voting               # Users are voting which statement they think is a lie
    REVEAL = :reveal               # Transition state between voting rounds, shows which one was a lie, + score
    SUMMARY = :summary             # End of round summary with scoreboard
  end

  def self.display_name
    "Two Truths, One Lie"
  end

  def self.max_users
    8
  end

  def process_message(data)
    puts "Got a message: #{data}"

    case data[:event]
    when Event::ENTERED_STATEMENTS
      process_entered_statement(data)
    when Event::VOTED
      process_vote(data)
    when Event::INITATED_NEXT_TURN
      # TODO
    when Event::INITIATED_NEXT_ROUND
      # TODO
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
    when Status::BRAINSTORMING
      storage.slice(:status, :leader_index, :users)
    when Status::VOTING
      storage.slice(:status, :leader_index, :users, :whos_turn_index)
    when Status::REVEAL
      storage
      # storage.slice(:status, :leader_index, :word, :users, :round_end_state)
    when Status::SUMMARY
      storage
      #
    end

    # Transform keys to camelCase as JS will expect
    data.deep_transform_keys{ |k| k.camelcase(:lower) }
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name,
        score: 0,
        statements: nil,
        has_voted: nil
      }
    end

    {
      status: Status::BRAINSTORMING,
      leader_index: 0,               # The index of the leader in the users list
      users: users_array,            # The users in the game
      whos_turn_index: nil,          # The current player who's statements are being voted on
    }
  end

  private

  # Helper for finding the current user in the
  def current_user_index(user_id)
    @current_user_index ||= []
    @current_user_index[user_id] ||= storage[:users].find_index do |user|
      user[:id] == user_id
    end
  end

  def process_entered_statement(data)
    user_index = current_user_index(data[:user_id])

    statements = [data[:truths], data[:lie]].flatten.shuffle

    storage[:users][user_index][:statements] = statements.map do |statement|
      {
        content: statement,
        is_lie: statement == data[:lie],
        voters: []
      }
    end

    if storage[:users].all? { |u| u[:statements] }
      transition_to_voting
    end
  end

  def transition_to_voting
    storage[:status] = Status::VOTING
    storage[:whos_turn_index] = 0
  end

  def process_vote(data)
    user_id = data[:user_id]
    vote_index = data[:vote_index]

    statements = storage[:users][storage[:whos_turn_index]][:statements]
    voted_statement = statements[vote_index]

    return if voted_statement[:voters].include?(user_id)
    voted_statement[:voters] << user_id

    total_votes = statements.sum { |a| a[:voters].count }
    if total_votes == storage[:users].count
      transition_to_reveal
    end
  end

  def transition_to_reveal
    storage[:status] = Status::REVEAL
    add_points_for_round
  end

  def add_points_for_round
    statements = storage[:users][storage[:whos_turn_index]][:statements]
    statements.each do |statement|
      is_lie = statement[:is_lie]
      next unless is_lie

      voters = statement[:voters]
      voters.each do |voter_id|
        # 5 points for guessing correctly
        user_index = storage[:users].find_index{ |user| user[:id] == voter_id }
        storage[:users][:score] += 5
      end
    end
  end
end
