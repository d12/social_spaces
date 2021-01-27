class DrawIt::EventHandlers::UserDisconnected < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user = User.find(data[:user])

    storage[:users].find { |u| u[:id] == data[:user] }[:disconnected] = true

    user_is_drawing = storage[:users][storage[:drawing_user_index]][:id] == data[:user]

    if(user_is_drawing) # Kill the turn, move on to the next one
      next_turn
    end

    instance.save!
    send_gamestate_to_all(instance)
  end

  private

  def storage
    instance.storage
  end

  # TODO: Deduplicate this logic between here and the guess/select_word event
  def next_turn
    storage[:drawing_user_index] = (storage[:drawing_user_index] + 1) % storage[:users].count
    if(storage[:drawing_user_index] == 0)
      storage[:round_number] += 1
    end

    storage[:users].each do |u|
      u[:has_guessed_current_word] = false
    end

    storage[:words_to_choose] = DrawIt::WORDS.sample(3)
    storage[:given_letters] = storage[:chosen_word]
    storage[:status] = "choosing"
  end
end
