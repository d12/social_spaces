class EventHandler
  def send_gamestate_to_all(instance)
    send_websocket_message(instance, { gameState: instance.client_data })
  end
  
  def send_websocket_message(entity, message)
    key = entity.websocket_key
    ActionCable.server.broadcast(key, message)
  end
end
