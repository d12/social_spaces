class SessionsController < ApplicationController
  skip_before_action :ensure_user_is_authenticated

  def destroy
    reset_session
    redirect_to react_path
  end
end
