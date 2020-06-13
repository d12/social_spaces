require "activity_loop"

class ActivityThreadManager
  def initialize(logger)
    @logger = logger

    # TODO: Ensure only one GameThreadManager
    # TODO: Resiliency? What happenes if a GameThreadManager dies?
  end

  def run
    logger.info "Activity thread manager booted"

    loop do
      next_loop = Time.now + 1.second

      logger.info "Checking for activity instances waiting for thread"
      ActivityInstance.where(status: :awaiting_activity_thread).each do |instance|
        setup_activity_process(instance)
      end

      time_til_next_loop = next_loop - Time.now
      if time_til_next_loop > 0
        sleep time_til_next_loop
      end
    end
  end

  private

  def setup_activity_process(instance)
    logger.info("Setting up activity process for instance #{instance.id}")
    instance.update(status: :ongoing)
    # TODO: More resiliency here eventually, an activity will get put in pending
    # and will freeze forever if the Thread fails to create.

    Thread.new {
      ActivityLoop.new(instance).run
    }
  end

  def logger
    @logger
  end
end
