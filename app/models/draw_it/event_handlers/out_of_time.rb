class DrawIt::EventHandlers::OutOfTime < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    next_turn

    send_gamestate_to_all(instance)
  end

  private

  def next_turn
    give_points_to_drawer

    storage[:drawing_user_index] = (storage[:drawing_user_index] + 1) % storage[:users].count
    if(storage[:drawing_user_index] == 0)
      storage[:round_number] += 1
    end

    storage[:users].each do |u|
      u[:has_guessed_current_word] = false
    end

    storage[:words_to_choose] = DrawIt::WORDS.sample(3)
    storage[:given_letters] = storage[:chosen_word]
    storage[:ran_out_of_time] = true
    storage[:status] = "choosing"

    instance.save!
    send_gamestate_to_all(instance)
  end

  def give_points_to_drawer
    storage[:users][storage[:drawing_user_index]][:score] += (correct_players_count * storage[:chosen_word].length)
  end

  def correct_players_count
    storage[:users].count{ |u| u[:has_guessed_current_word] }
  end

  def storage
    instance.storage
  end
end
