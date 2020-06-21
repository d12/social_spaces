class TwentyQuestions < ActivityInstance
  def self.display_name
    "Twenty Questions"
  end

  def self.max_users
    8
  end

  def message(data)
    return unless data["add"]

    state[:count] += 1
    save!

    {updatedCount: state[:count]}
  end

  def tick

  end

  # All the data required for a client to bootstrap itself
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_bootstrap_data
    reload
    {count: state[:count]}
  end

  # The initial value to use for a instances save state
  def initial_state
    {count: 0}
  end
end
