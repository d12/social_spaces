class SessionsController < ApplicationController
  def redirect_to_google_oauth
    if key = params["room_key"]
      session[:join_group_after_auth] = key
    end

    redirect_to user_google_oauth2_omniauth_authorize_path
  end

  def destroy
    current_group&.remove_user(current_user)
    reset_session

    redirect_to root_path
  end
end
