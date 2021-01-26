class ActivityClock
  attr_reader :logger

  LOOP_FREQUENCY = 1.second

  def initialize(logger)
    @logger = logger
  end

  def run
    logger.info("Beginning Activity Clock")

    loop do
      time_before_loop = Time.now
      next_loop = time_before_loop + LOOP_FREQUENCY

      instances.each do |instance|
        run_tick(instance)
      end

      time_after_loop = Time.now

      time_til_next_loop = next_loop - time_after_loop
      total_loop_runtime = time_after_loop - time_before_loop

      logger.info("Took #{total_loop_runtime}s, or #{((total_loop_runtime / LOOP_FREQUENCY) * 100).round(2)}% of available time.")

      if time_til_next_loop > 0
        sleep time_til_next_loop
      end
    end
  end

  private

  def run_tick(instance)
    instance.tick
    logger.info("Ticked activity #{instance.id}")
  rescue StandardError => e
    logger.error("Error ticking activity #{instance.id}")
    logger.error(e.full_message)
  end

  def instances
    ActivityInstance.all
  end
end