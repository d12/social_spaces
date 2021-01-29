# WARNING: The Clock will send multiple ticks per second to activities if there are multiple clocks running at once.
#          If two ticks were sent to an activity at almost the same time, it's possible to get weird "double-actions"
#          like skipping someone's turn, or moving 2 spaces instead of one. TODO: Solve this with locking. If the lock
#          is held on an activity, the clock can move on.

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

      check_for_inactive_users

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

  def check_for_inactive_users
    User.where("disconnected_at < ?", User::INACTIVITY_TIMEOUT.ago).each do |user|
      unless group = user.group
        logger.info("User #{user.id} had no group. Unsetting disconnected_at time.")
        user.update(disconnected_at: nil)
        next
      end

      group.remove_user(user)

      logger.info("Removed user #{user.id} from group #{group.key} for inactivity.")
    end
  end

  def instances
    ActivityInstance.all
  end
end