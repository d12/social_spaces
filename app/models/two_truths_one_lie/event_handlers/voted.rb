class TwoTruthsOneLie::EventHandlers::Voted
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user_id = data[:user_id]
    vote_index = data[:vote_index]
    statements = storage[:users][storage[:whos_turn_index]][:statements]
    voted_statement = statements[vote_index]

    return if instance.user_by_id(user_id)[:has_voted]

    voted_statement[:voters] << user_id
    instance.user_by_id(user_id)[:has_voted] = true

    total_votes = statements.sum { |a| a[:voters].count }
    if total_votes == storage[:users].count - 1
      add_points_for_round
      transition_to_reveal
    end
  end

  private

  def transition_to_reveal
    storage[:status] = TwoTruthsOneLie::Status::REVEAL
  end

  def add_points_for_round
    statements = storage[:users][storage[:whos_turn_index]][:statements]
    statements.each do |statement|
      is_lie = statement[:is_lie]
      next unless is_lie

      voters = statement[:voters]
      voters.each do |voter_id|
        # 5 points for guessing correctly
        instance.user_by_id(voter_id)[:score] += 5
      end
    end
  end

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
