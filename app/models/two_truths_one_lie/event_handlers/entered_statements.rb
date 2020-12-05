class TwoTruthsOneLie::EventHandlers::EnteredStatements < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
    statements = [data[:truths], data[:lie]].flatten.shuffle

    instance.user_by_id(data[:user_id])[:statements] = statements.map do |statement|
      {
        content: statement,
        is_lie: statement == data[:lie],
        voters: []
      }
    end

    if storage[:users].all? { |u| u[:statements] }
      transition_to_voting
    end

    send_gamestate_to_all(instance)
  end

  private

  def transition_to_voting
    storage[:status] = TwoTruthsOneLie::Status::VOTING
    storage[:whos_turn_index] = 0
  end

  def storage
    instance.storage
  end
end
