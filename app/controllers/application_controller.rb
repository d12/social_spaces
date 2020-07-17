class ApplicationController < ActionController::Base
  before_action :ensure_user_is_authenticated
  before_action :redirect_to_activity_if_in_progress

  private

  def not_found
    render plain: "Not found", status: 404
  end

  def current_group
    @current_group ||= current_user.group
  end

  def ensure_user_is_authenticated
    return if current_user

    redirect_to user_google_oauth2_omniauth_authorize_path
  end

  # If a user has a game in progress, always redirect them back to the game incase
  # They accidentally hit back or get lost. There is a button on the UI to leave the group.
  def redirect_to_activity_if_in_progress
    return if request.path == "/play"

    if current_user && current_group && ActivityInstance.find_by(group: current_group)
      redirect_to show_activity_path
    end
  end
end
