class DrawIt < ActivityInstance
  register_event "draw", DrawIt::EventHandlers::Draw
  register_event "user_joined", DrawIt::EventHandlers::UserJoined
  register_event "user_disconnected", DrawIt::EventHandlers::UserDisconnected
  register_event "erase", DrawIt::EventHandlers::Erase
  register_event "select_word", DrawIt::EventHandlers::SelectWord
  register_event "guess", DrawIt::EventHandlers::Guess

  WORDS = [
    "cat",
    "dog",
    "horse",
    "rabbit",
    "squirrel",
    "newspaper",
    "tongue",
    "dad",
    "apartment",
    "volume",
    "police",
    "passenger",
    "reception",
    "oven",
    "funeral",
    "child",
    "girl",
    "cabinet",
    "wealth",
    "farmer",
    "tooth",
    "hotel",
    "world",
    "art",
    "reflection",
    "beer",
    "bath",
    "birthday",
    "reaction",
    "science",
    "police",
    "computer",
    "construction",
    "government",
    "wife",
    "painting",
    "chocolate",
    "cookie",
    "speaker",
    "month",
    "grandmother",
    "grandfather",
    "student",
    "conversation",
    "classroom",
    "union",
    "chapter",
    "software",
    "altitude",
    "lake",
    "church",
    "judgment",
    "leadership",
    "sir",
    "song",
    "pizza",
    "agreement",
    "piano",
    "soup",
    "internet",
    "potato",
    "investment",
    "flight",
    "supermarket",
    "resolution",
    "video",
    "highway",
    "chemistry",
    "employee",
    "virus",
    "depression",
    "signature",
    "competition",
    "wood",
    "injury",
    "push",
    "smile",
    "drain",
    "approve",
    "crack",
    "underline",
    "train",
    "connect",
    "teach",
    "ship",
    "recall",
    "mount",
    "lower",
    "discuss",
    "write",
    "think",
    "force",
    "value",
    "shiver",
    "address",
    "wind",
    "stop",
    "sit",
    "long",
    "destroy",
    "dig",
    "throw",
    "comment",
    "fly",
    "whisper",
    "grin",
    "step",
  ].uniq

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
    2
  end

  def self.max_users
    8
  end

  def tick
    puts "tock"
  end

  def client_data
    storage.slice(
      :users,
      :status,
      :drawing_user_index,
      :words_to_choose,
      :given_letters,
      :round_number
    ).deep_transform_keys{ |k| k.camelcase(:lower) }
  end

  # The initial value to use for a instances save state
  def initial_storage
    users_array = users.map do |user|
      {
        id: user.id,
        name: user.name,
        score: 0,
        has_guessed_current_word: false,
      }
    end

    {
      status: "choosing",
      words_to_choose: WORDS.sample(3),
      chosen_word: nil,
      drawing_user_index: 0,
      users: users_array,
      given_letters: nil,
      round_number: 1,
    }
  end
end
