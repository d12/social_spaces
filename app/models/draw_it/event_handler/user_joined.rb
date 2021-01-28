class DrawIt::EventHandler::UserJoined < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user = User.find(data[:user_id])

    if existing_user = storage[:users].find{|a| a[:id] == data[:user_id]}
      existing_user[:disconnected] = false
    else
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

    instance.save!
    send_gamestate_to_all(instance)
  end
end
