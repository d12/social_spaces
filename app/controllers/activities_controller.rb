class ActivitiesController < ApplicationController
  before_action :ensure_group
  before_action :ensure_activity_exists, only: [:join]

  skip_before_action :redirect_to_activity_if_in_progress, only: [:leave]

  ACTIVITIES = [
    TwentyQuestions
  ]

  def index
    @user = current_user
    @group = current_group

    @activities = ACTIVITIES
  end

  def join
    @user = current_user
    @group = current_group

    unless @user == @group.host
      flash[:alert] = "Only the host can start a new game"
      return redirect_back(fallback_location: root_path)
    end

    if ActivityInstance.find_by(group: @group)
      flash[:alert] = "You must leave your current activity before joining a new one."
      return redirect_back(fallback_location: root_path)
    end

    @instance = ActivityInstance.create(
      group: @group,
      activity: params[:activity],
      status: :awaiting_activity_thread
    )

    @bootstrap_data = @instance.client_bootstrap_data

    GroupChannel.broadcast_activity_started(@group)

    redirect_to play_activity_path(params[:activity].underscore)
  end

  def show
    @user = current_user
    @group = current_group
    @instance = ActivityInstance.find_by(group: @group)

    unless @instance
      flash[:alert] = "Your group is not currently in this activity"
      return redirect_back(fallback_location: root_path)
    end

    @bootstrap_data = @instance.client_bootstrap_data

    render "activities/#{@instance.activity.underscore}"
  end

  def leave
    @user = current_user
    @group = current_group

    unless @user == @group.host
      flash[:alert] = "Only the host can leave an activity"
      return redirect_back(fallback_location: root_path)
    end

    ActivityInstance.find_by(group: @group).destroy

    # TODO: Broadcast to group to send them back to the activities page

    redirect_to activities_path
  end

  private

  def ensure_activity_exists
    unless ACTIVITIES.include?(params[:activity].constantize)
      return not_found
    end
  end

  def ensure_group
    redirect_to groups_path unless current_group
  end
end
