class EventHandler
  def send_gamestate_to_all(instance)
    instance.save

    send_websocket_message(instance, { gameState: instance.game_state })
  end

  def send_websocket_message(entity, message)
    key = entity.websocket_key
    ActionCable.server.broadcast(key, message)
  end
end
