class TwoTruthsOneLie::EventHandlers::InitiatedNextTurn
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    puts "INITIATED NEXT TURN"
  end

  private

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
