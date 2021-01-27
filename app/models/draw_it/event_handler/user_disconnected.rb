class DrawIt::EventHandler::UserDisconnected < EventHandler
  include DrawIt::EventHandlerHelper

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
end
