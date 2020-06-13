class ActivitiesController < ApplicationController
  before_action :ensure_group

  def index
    @user = current_user
    @group = current_group

    @activities = [
      Activity::Chat,
      Activity::Skribbl
    ]
  end

  def join
    # TODO: There will be a whitelist of valid activities. We should validate here.
    ActivityInstance.create(
      group: current_group,
      activity: params[:activity],
      status: :awaiting_activity_thread,
    )

    # TODO: Render some UI here.
    # TODO: Send an actioncable message to all participants sending them to the UI as well.

    render plain: "Hello"
  end

  private

  def ensure_group
    redirect_to groups_path unless current_group
  end
end
