class TwoTruthsOneLie::EventHandlers::InitiatedNextRound < EventHandler
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    clear_user_data
    storage[:whos_turn_index] = nil
    storage[:round_count] += 1
    storage[:status] = TwoTruthsOneLie::Status::BRAINSTORMING

    send_gamestate_to_all(instance)
  end

  private

  attr_reader :instance

  def clear_user_data
    storage[:users].each do |user|
      user[:statements] = nil
      user[:score] = 0
    end
  end

  def storage
    instance.storage
  end
end
