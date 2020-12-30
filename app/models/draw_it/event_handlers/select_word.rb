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

    # Clear the canvas before the next round
    instance.draw_event_batches.delete_all
    send_websocket_message(instance, { erase: true, authorId: data["user_id"] })

    send_gamestate_to_all(instance)
  end

  private

  def storage
    instance.storage
  end
end
