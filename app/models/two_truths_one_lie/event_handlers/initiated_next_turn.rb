class TwoTruthsOneLie::EventHandlers::InitiatedNextTurn < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    clear_user_round_data

    storage[:whos_turn_index] = (storage[:whos_turn_index] + 1) % storage[:users].count

    storage[:status] = if storage[:whos_turn_index] == 0
      TwoTruthsOneLie::Status::SUMMARY
    else
      TwoTruthsOneLie::Status::VOTING
    end

    send_gamestate_to_all(instance)
  end

  private

  def clear_user_round_data
    storage[:users].each do |user|
      user[:has_voted] = nil
    end
  end

  def storage
    instance.storage
  end
end
