class TwoTruthsOneLie::EventHandlers::InitiatedNextRound
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    puts "INITIATED NEXT ROUND"
  end

  private

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
