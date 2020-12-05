class Clicker < ActivityInstance
  def self.display_name
    "Clicker"
  end

  def self.description
    "A button that increments a multiplayer-synced counter. Endless hours of fun for the whole family!"
  end

  def self.min_users
    1
  end

  def self.max_users
    8
  end

  def tick
    puts "tock"
  end

  def process_message(data)
    return unless data["add"]

    storage[:count] += 1
    save!

    send_activity_channel_message({ gameState: client_data })
  end

  # All the data required for a client to bootstrap itself
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_data
    { count: storage[:count] }
  end

  # The initial value to use for a instances save state
  def initial_storage
    { count: 0 }
  end
end
