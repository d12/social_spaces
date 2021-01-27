class DrawIt::EventHandler::OutOfTime < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    next_turn(ran_out_of_time: true)

    instance.save
    send_gamestate_to_all(instance)
  end
end
