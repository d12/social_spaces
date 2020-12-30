class DrawIt::EventHandlers::UserJoined < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user = User.find(data[:user_id])

    unless storage[:users].find{|a| a[:id] == data[:user_id]}
      storage[:users].push({
        id: user.id,
        name: user.name,
        score: 0,
        has_guessed_current_word: false,
      })
    end

    if(storage[:users][storage[:drawing_user_index]][:id] == data[:user_id])
      send_websocket_message(user, { wordForDrawer: storage[:chosen_word] })
    end

    send_websocket_message(user, { drawEvents: draw_events })
    send_gamestate_to_all(instance)
  end

  private

  def draw_events
    instance.draw_event_batches.order(:created_at).pluck(:draw_data).flatten(1)
  end

  def storage
    instance.storage
  end
end
