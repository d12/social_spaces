class DrawIt::EventHandler::PlayAgain < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    return unless instance.storage[:status] == "game_over"

    old_version = instance.storage[:version]

    instance.storage = instance.initial_storage
    instance.storage[:version] = old_version + 1

    instance.save!
    send_gamestate_to_all(instance)
  end
end
