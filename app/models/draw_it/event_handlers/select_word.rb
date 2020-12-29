class DrawIt::EventHandlers::SelectWord < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    storage[:chosen_word] = storage[:words_to_choose][data["word_index"].to_i]
    storage[:words_to_choose] = nil
    storage[:status] = "drawing"
    storage[:given_letters] = "_" * storage[:chosen_word].length

    send_gamestate_to_all(instance)
  end

  private

  def storage
    instance.storage
  end
end
