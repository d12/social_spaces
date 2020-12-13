class TwoTruthsOneLie < ActivityInstance
  class Status
    WAITING_TO_START = :waiting_to_start  # Waiting on players to join and host to start
    BRAINSTORMING = :brainstorming        # Users are entering statements
    VOTING = :voting                      # Users are voting which statement they think is a lie
    REVEAL = :reveal                      # Transition state between voting rounds, shows which one was a lie, + score
    SUMMARY = :summary                    # End of round summary with scoreboard
  end

  register_event "begin_game", EventHandlers::BeginGame
  register_event "entered_statements", TwoTruthsOneLie::EventHandlers::EnteredStatements
  register_event "voted", TwoTruthsOneLie::EventHandlers::Voted
  register_event "initiated_next_turn", TwoTruthsOneLie::EventHandlers::InitiatedNextTurn
  register_event "initated_next_round", TwoTruthsOneLie::EventHandlers::InitiatedNextRound

  def self.display_name
    "Two Truths, One Lie"
  end

  def self.description
    "Players put together two truths and one lie about themselves. For each player, the group works together to guess which statement is a lie."
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
    leader_index = 0

    users_array = users.each_with_index.map do |user, index|
      leader_index = index if user.id == group.host_id

      {
        id: user.id,
        name: user.name,
        score: 0,
        statements: nil,
        has_voted: nil
      }
    end

    {
      status: Status::WAITING_TO_START,
      leader_index: nil,    # The index of the leader in the users list
      users: users_array,   # The users in the game
      whos_turn_index: nil, # The current player who's statements are being voted on
      round_count: 1
    }
  end

  # Helper for finding a user in the storage
  def user_by_id(user_id)
    storage[:users].find do |user|
      user[:id] == user_id
    end
  end
end
