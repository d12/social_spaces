require "logger"

class ActivityLoop
  def initialize(instance)
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
    set_logger_format

    @instance = instance
  end

  def run
    loop do
      begin_time = Time.now
      next_cycle_time = begin_time + 0.25.seconds

      tick

      difference = next_cycle_time - Time.now
      if difference > 0
        sleep difference
      end
    end
  end

  private

  # Runs once per tick, all important game logic goes in here
  def tick
    # TODO: This should call to a tick method per-game
    logger.info "Tick!"
  end

  def set_logger_format
    original_formatter = Logger::Formatter.new
    @logger.formatter = proc { |severity, datetime, progname, msg|
      original_formatter.call(severity, datetime, progname, "[ActivityLoop-Instance##{@instance.id}] #{msg}")
    }
  end

  def logger
    @logger
  end
end
