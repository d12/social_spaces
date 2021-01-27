class DrawIt::EventHandler::SelectWord < EventHandler
  include DrawIt::EventHandlerHelper

  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    user = User.find(storage[:users][storage[:drawing_user_index]][:id])

    storage[:chosen_word] = storage[:words_to_choose][data["word_index"].to_i]
    storage[:words_to_choose] = nil
    storage[:status] = "drawing"
    storage[:given_letters] = "_" * storage[:chosen_word].length
    storage[:round_expire_time] = DrawIt::ROUND_LENGTH.from_now.to_i
    storage[:letter_reveal_time] = DrawIt::TIME_BETWEEN_REVEALS.from_now.to_i
    storage[:ran_out_of_time] = false

    storage[:users].each do |user|
      user[:has_guessed_current_word] = false
    end

    send_websocket_message(instance, {
      chatMessage: { content: "#{user.name} has started drawing.", type: "notice" },
      authorId: data["user_id"]
    })

    # Clear the canvas before the next round
    instance.draw_event_batches.delete_all
    send_websocket_message(instance, { erase: true, authorId: data["user_id"] })

    send_websocket_message(user, { wordForDrawer: storage[:chosen_word] })

    instance.save!

    send_gamestate_to_all(instance)
  end

  private

  def storage
    instance.storage
  end
end
