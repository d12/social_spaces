class SessionsController < ApplicationController
  skip_before_action :ensure_user_is_authenticated

  def create
    @user = User.from_omniauth(auth)
    session[:user_id] = @user&.id
    redirect_to groups_path
  end

  def destroy
    reset_session
    redirect_to react_path
  end

  private

  def auth
    request.env['omniauth.auth']
  end
end
