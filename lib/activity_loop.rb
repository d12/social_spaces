require "logger"

class ActivityLoop
  TICK_FREQUENCY = 1.second
  DISCONNECT_THRESHOLD = 5.seconds

  def initialize(instance)
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
    set_logger_format

    @instance = instance
    @id = @instance.id
  end

  # TODO: Handle exceptions.
  # If we have an exception in `tick`, the whole activity loop is killed and the game is stuck.
  def run
    loop do
      terminate_thread if activity_finished?

      begin_time = Time.now
      next_cycle_time = begin_time + TICK_FREQUENCY

      remove_disconnected_users

      @instance.tick

      difference = next_cycle_time - Time.now
      if difference > 0
        sleep difference
      end
    end
  end

  private

  def activity_finished?
    @instance.reload
    false
  rescue ActiveRecord::RecordNotFound
    true
  end

  def terminate_thread
    puts "Activity instance #{@id} no longer exists - terminating activity loop!"
    Thread.exit
  end

  def remove_disconnected_users
    users = @instance.users.where("disconnected_at IS NOT NULL")

    users.each do |user|
      if Time.zone.now - user.disconnected_at > DISCONNECT_THRESHOLD
        @instance.disconnect_user(user)
        user.update(disconnected_at: nil)
      end
    end
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
