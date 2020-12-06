class DrawIt < ActivityInstance
  register_event "draw", DrawIt::EventHandlers::Draw
  register_event "user_joined", DrawIt::EventHandlers::UserJoined

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
    1
  end

  def self.max_users
    8
  end

  def tick
    puts "tock"
  end

  def client_data
    storage.slice(:users, :status, :drawing_user_index).deep_transform_keys{ |k| k.camelcase(:lower) }
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
      draw_events: [],
      drawing_user_index: 0,
      users: users_array,
    }
  end
end
