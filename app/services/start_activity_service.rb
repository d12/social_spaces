class StartActivityService
  def initialize(activity:, group:, actor:)
    @activity = activity
    @group = group
    @actor = actor

    @errors = []
    @instance = nil
  end

  def call
    if validate
      create_activity
      broadcast_activity_start
    end

    self
  end

  def errors
    @errors
  end

  def succeeded?
    @errors.any?
  end

  def instance
    @instance
  end

  private

  def validate
    validate_actor_is_group_host
    validate_group_is_not_in_an_activity

    @errors.empty?
  end

  def validate_actor_is_group_host
    unless @actor == @group.host
      @errors << "Only the host can start a new game"
    end
  end

  def validate_group_is_not_in_an_activity
    if ActivityInstance.find_by(group: @group)
      @errors << "You must leave your current activity before joining a new one."
    end
  end

  def broadcast_activity_start
    GroupChannel.broadcast_activity_started(@group)
  end

  # TODO: Any errors that happen in here should be added to @errors
  def create_activity
    @instance = ActivityInstance.create(
      group: @group,
      activity: @activity,
      status: :awaiting_activity_thread
    )
  end
end
