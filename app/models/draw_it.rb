class DrawIt < ActivityInstance
  class Status
    DRAWING = :drawing
  end

  def self.display_name
    "Draw It"
  end

  def self.description
    "It's literally Skribbl.io"
  end

  def self.min_users
    2
  end

  def self.max_users
    8
  end

  def tick
    puts "tock"
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name
      }
    end

    {
      status: Status::DRAWING,
    }
  end
end
