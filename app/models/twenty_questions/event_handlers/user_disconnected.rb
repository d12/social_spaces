class TwentyQuestions::EventHandlers::UserDisconnected
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    # storage[:word] = data[:word]
    # storage[:status] = TwentyQuestions::Status::ASKING_QUESTIONS
    # storage[:question_index] = 1
    #
    # instance.set_next_asker
  end

  private

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
