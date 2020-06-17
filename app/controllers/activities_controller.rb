class ActivitiesController < ApplicationController
  before_action :ensure_group
  before_action :ensure_activity_exists, only: [:join]

  skip_before_action :redirect_to_activity_if_in_progress, only: [:leave]

  ACTIVITIES = [
    "twenty_questions",
    "chat",
    "skribbl"
  ]

  def index
    @user = current_user
    @group = current_group

    @activities = [
      Activity::Chat,
      Activity::Skribbl,
      Activity::TwentyQuestions
    ]
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

    GroupChannel.broadcast_activity_started(@group)

    redirect_to play_activity_path(params[:activity])
  end

  def show
    @user = current_user
    @group = current_group
    @instance = ActivityInstance.find_by(group: @group)

    unless @instance
      flash[:alert] = "Your group is not currently in this activity"
      return redirect_back
    end

    render "activities/#{@instance.activity}"
  end

  def leave
    @user = current_user
    @group = current_group

    unless @user == @group.host
      flash[:alert] = "Only the host can leave an activity"
      return redirect_back
    end

    ActivityInstance.find_by(group: @group).destroy

    # TODO: Broadcast to group to send them back to the actiities page

    redirect_to activities_path
  end

  private

  def ensure_activity_exists
    unless ACTIVITIES.include?(params[:activity])
      return not_found
    end
  end

  def ensure_group
    redirect_to groups_path unless current_group
  end
end
