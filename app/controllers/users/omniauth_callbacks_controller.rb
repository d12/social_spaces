class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in @user, :event => :authentication
      set_flash_message(:notice, :success, :kind => "Google") if is_navigational_format?
    else
      raise "Ah fuck, this shouldn't happen"
    end

    redirect_to react_path
  end
end
