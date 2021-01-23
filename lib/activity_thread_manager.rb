require "activity_loop"

class ActivityThreadManager
  attr_reader :handled_activities

  def initialize(logger)
    @logger = logger
    @handled_activities = []

    # TODO: Ensure only one ActivityThreadManager
    #        - Actually we could have multiple, but we need better locking on picking up activities.
    # TODO: Resiliency? What happenes if a ActivityThreadManager dies?
  end

  def run
    begin
      logger.info "Activity thread manager booted"

      loop do
        next_loop = Time.now + 1.second

        logger.info "Checking for activity instances waiting for thread"
        ActivityInstance.where(status: :awaiting_activity_thread).each do |instance|
          setup_activity_process(instance)
          @handled_activities << instance.id
        end

        time_til_next_loop = next_loop - Time.now
        if time_til_next_loop > 0
          sleep time_til_next_loop
        end
      end
    rescue SignalException => e # Note, this won't catch SIGKILL signals
      logger.info "Caught signal, dropping all activities."

      @handled_activities.each do |activity_id|
        activity = ActivityInstance.find_by(id: activity_id)
        next unless activity

        activity.status = :awaiting_activity_thread
        activity.save(validate: false)
      end
    end
  end

  private

  def setup_activity_process(instance)
    logger.info("Setting up activity process for instance #{instance.id}")

    instance.status = :ongoing

    # TODO: Ensure this saves successfully, otherwise we get infinite threads
    # TODO: More resiliency here eventually, an activity will get put in pending
    # and will freeze forever if the Thread fails to create.

    if(instance.save(validate: :false))
      Thread.new {
        ActivityLoop.new(instance).run
      }
    else
      logger.info("Found unhealthy activity #{instance.id}, terminating")
      instance.destroy
    end
  end

  def logger
    @logger
  end
end
