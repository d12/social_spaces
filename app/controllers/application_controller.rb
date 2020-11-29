class ApplicationController < ActionController::Base
  before_action :ensure_user_is_authenticated

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
end
