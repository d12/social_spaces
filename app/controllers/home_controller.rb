class HomeController < ApplicationController
  skip_before_action :ensure_user_is_authenticated
  before_action :ensure_user_is_not_authenticated

  def index; end

  private

  def ensure_user_is_not_authenticated
    if current_user
      redirect_to groups_path
    end
  end
end
