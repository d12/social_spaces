class DrawIt::EventHandlers::SelectWord < EventHandler
  attr_reader :instance

  def initialize(instance:)
    @instance = instance
  end

  def call(data)
     # do select word stuff.
  end
end
