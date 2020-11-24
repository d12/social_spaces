class StartActivityService
  def initialize(activity:, group:, actor:)
    @activity = activity
    @group = group
    @actor = actor

    @errors = []
    @activity_instance = nil
  end

  def call
    validate
    return self if @errors.any?

    build_activity
    if @activity_instance.save
      broadcast_activity_start
    else
      @errors += @activity_instance.errors.full_messages
    end

    self
  end

  def errors
    @errors
  end

  def succeeded?
    @errors.empty?
  end

  def instance
    @activity_instance
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

  def build_activity
    @activity_instance = ActivityInstance.new(
      group: @group,
      activity: @activity,
      status: :awaiting_activity_thread
    )
  end
end
