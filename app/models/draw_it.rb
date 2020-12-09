class DrawIt < ActivityInstance
  register_event "draw", DrawIt::EventHandlers::Draw
  register_event "user_joined", DrawIt::EventHandlers::UserJoined
  register_event "erase", DrawIt::EventHandlers::Erase

  # Note we're delete_all'ing here for perf. This skips callbacks, so be careful there.
  has_many :draw_event_batches, class_name: "DrawIt::DrawEventBatch", foreign_key: "activity_instance_id", dependent: :delete_all

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
      drawing_user_index: 0,
      users: users_array,
    }
  end
end
