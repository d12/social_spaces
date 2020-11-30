class SessionsController < ApplicationController
  def redirect_to_google_oauth
    redirect_to user_google_oauth2_omniauth_authorize_path
  end

  def destroy
    current_group&.remove_user(current_user)
    reset_session
    
    redirect_to react_path
  end
end
