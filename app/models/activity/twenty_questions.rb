class Activity::TwentyQuestions < Activity
  class << self
    def display_name
      "Twenty Questions"
    end

    def max_users
      8
    end

    def tick(instance)

    end
  end
end
