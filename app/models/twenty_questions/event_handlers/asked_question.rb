class TwentyQuestions::EventHandlers::AskedQuestion
  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    case data[:result]
    when "yes", "no"
      process_yes_no
    when "correctanswer"
      process_correct_answer
    else
      raise "Unknown result #{data[:result]}"
    end
  end

  private

  def process_yes_no
    if storage[:question_index] == 20
      storage[:round_end_state] = "lose"
      storage[:status] = TwentyQuestions::Status::ROUND_END
      return
    end

    storage[:question_index] += 1
    instance.set_next_asker
  end

  def process_correct_answer
    storage[:round_end_state] = "win"
    storage[:status] = TwentyQuestions::Status::ROUND_END
  end

  def instance
    @instance
  end

  def storage
    instance.storage
  end
end
