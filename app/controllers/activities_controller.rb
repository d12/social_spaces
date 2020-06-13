class ActivitiesController < ApplicationController
  before_action :ensure_group
  before_action :ensure_activity_exists, only: [:join]

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

    if ActivityInstance.find_by(group: @group)
      flash[:alert] = "You must leave your current activity before joining a new one."
      return redirect_back
    end

    @instance = ActivityInstance.create(
      group: @group,
      activity: params[:activity],
      status: :awaiting_activity_thread
    )

    # TODO: Send an actioncable message to all participants sending them to the UI as well.

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
