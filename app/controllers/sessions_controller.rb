class SessionsController < ApplicationController
  skip_before_action :ensure_user_is_authenticated

  def omniauth
    @user = User.from_omniauth(auth)
    session[:user_id] = @user.id
    redirect_to root_path
  end

  private

  def auth
    request.env['omniauth.auth']
  end
end
