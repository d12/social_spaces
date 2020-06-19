class Activity::TwentyQuestions < Activity
  class << self
    def display_name
      "Twenty Questions"
    end

    def max_users
      8
    end

    def message(instance, data)
      return unless data["add"]
      if data["add"]
        instance.state["count"] += 1
        instance.save
      end

      {"updatedCount" => instance.state["count"]}
    end

    def tick(instance)

    end

    # All the data required for a client to bootstrap itself
    # E.g. When a client joins midway, they need enough information
    # to render the current state of the game
    def client_bootstrap_data(instance)
      {"count" => instance.state["count"]}
    end

    # The initial value to use for a instances save state
    def initialize_storage
      {"count" => 0}
    end
  end
end
