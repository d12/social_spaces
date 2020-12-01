class Experimental < ActivityInstance
  def self.display_name
    "Experimental Activity"
  end

  def self.description
    "A whole bunch of jank in here."
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

  # All the data required for a client to bootstrap itself
  # E.g. When a client joins midway, they need enough information
  # to render the current state of the game
  def client_data
    reload
    {}
  end

  # The initial value to use for a instances save state
  def initial_storage
    {}
  end
end
