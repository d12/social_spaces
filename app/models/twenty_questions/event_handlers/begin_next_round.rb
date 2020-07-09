class TwentyQuestions::EventHandlers::BeginNextRound
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    instance.set_next_leader

    storage[:status] = TwentyQuestions::Status::SELECTING_WORD
    storage[:word] = nil
    storage[:word_options] = TwentyQuestions::WORDS.sample(3)
  end

  private

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
