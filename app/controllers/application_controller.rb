class ApplicationController < ActionController::Base
  before_action :ensure_user_is_authenticated

  private

  def not_found
    render plain: "Not found", status: 404
  end

  def current_user
    @user ||= User.find_by(id: session[:user_id])
  end

  def ensure_user_is_authenticated
    return if current_user

    redirect_to "/auth/google_oauth2"
  end
end
