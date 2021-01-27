# Shared logic for the DrawIt event handlers
module DrawIt::EventHandlerHelper
  def next_turn(ran_out_of_time: false)
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
    storage[:ran_out_of_time] = ran_out_of_time
    storage[:status] = "choosing"
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