# Shared logic for the DrawIt event handlers
module DrawIt::EventHandlerHelper
  def next_turn(ran_out_of_time: false)
    if(connected_players_count <= 1)
      return
    end

    give_points_to_drawer

    next_player_index, next_round = get_next_player

    storage[:drawing_user_index] = next_player_index
    if(next_round)
      storage[:round_number] += 1
    end

    storage[:users].each do |u|
      u[:has_guessed_current_word] = false
    end

    storage[:words_to_choose] = DrawIt::WORDS_HASH[storage[:difficulty]].sample(3)
    storage[:given_letters] = storage[:chosen_word]
    storage[:ran_out_of_time] = ran_out_of_time
    storage[:status] = "choosing"
  end

  def get_next_player
    index = storage[:drawing_user_index]
    next_round = false

    storage[:users].count.times do |i|
      index = (index + 1) % storage[:users].count
      if index == 0
        next_round = true
      end

      if(!storage[:users][index][:disconnected])
        return [index, next_round]
      end
    end
  end

  def give_points_to_drawer
    storage[:users][storage[:drawing_user_index]][:score] += ((correct_players_count * storage[:chosen_word].length) * 5).round(-1)
  end

  def correct_players_count
    storage[:users].count{ |u| u[:has_guessed_current_word] }
  end

  def connected_players_count
    storage[:users].count { |u| !u[:disconnected] }
  end

  def storage
    instance.storage
  end
end