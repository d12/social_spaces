class ActivitiesController < ApplicationController
  def index
    @user = current_user

    @activities = [
      Activity::Chat,
      Activity::Skribbl
    ]
  end
end
