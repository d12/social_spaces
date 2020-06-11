class ActivitiesController < ApplicationController
  before_action :ensure_group

  def index
    @user = current_user
    @group = current_group

    @activities = [
      Activity::Chat,
      Activity::Skribbl
    ]
  end

  private

  def ensure_group
    redirect_to groups_path unless current_group
  end
end
