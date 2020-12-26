class TwoTruthsOneLie::EventHandlers::InitiatedNextTurn < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    clear_user_round_data

    storage[:whos_turn_index] = (storage[:whos_turn_index] + 1) % storage[:users].count

    storage[:status] = if storage[:whos_turn_index] == 0
      TwoTruthsOneLie::Status::BRAINSTORMING
    else
      TwoTruthsOneLie::Status::VOTING
    end

    prepare_new_round if storage[:status] == TwoTruthsOneLie::Status::BRAINSTORMING

    send_gamestate_to_all(instance)
  end

  private

  def clear_user_round_data
    storage[:users].each do |user|
      user[:has_voted] = nil
    end
  end

  def prepare_new_round
    storage[:users].each do |user|
      user[:statements] = nil
    end

    storage[:whos_turn_index] = nil
    storage[:round_count] += 1
  end

  def storage
    instance.storage
  end
end
