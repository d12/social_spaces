class ActivitiesController < ApplicationController
  before_action :ensure_group
  before_action :ensure_activity_exists, only: [:join]
  before_action :ensure_current_activity, only: [:show, :leave]

  skip_before_action :redirect_to_activity_if_in_progress, only: [:leave]

  ACTIVITIES = [
    TwentyQuestions,
    TwoTruthsOneLie,
    Clicker
  ]

  def index
    @user = current_user
    @group = current_group

    @activities = ACTIVITIES
  end

  def join
    result = StartActivityService.new(
      activity: params[:activity],
      group: current_group,
      actor: current_user
    ).call

    if result.errors
      flash[:error] = result.errors.join(", ")
      return redirect_to(activities_path)
    end

    redirect_to show_activity_path(params[:activity].underscore)
  end

  def show
    @user = current_user
    @group = current_group
    @instance = current_activity

    @bootstrap_data = @instance.client_data

    render "activities/#{@instance.activity.underscore}"
  end

  def leave
    @user = current_user
    @group = current_group

    unless @user == @group.host
      flash[:alert] = "Only the host can leave an activity"
      return redirect_back(fallback_location: activities_path)
    end

    ActivityInstance.find_by(group: @group).destroy

    # TODO: Broadcast to group to send them back to the activities page

    redirect_to activities_path
  end

  private

  def current_activity
    @current_activity ||= ActivityInstance.find_by(group: current_group)
  end

  def ensure_activity_exists
    unless ACTIVITIES.include?(params[:activity].constantize)
      return not_found
    end
  end

  def ensure_current_activity
    unless current_activity
      flash[:error] = "You can't do this unless you're in an activity!"
      redirect_back(fallback_location: activities_path)
    end
  end

  def ensure_group
    redirect_to groups_path unless current_group
  end
end
