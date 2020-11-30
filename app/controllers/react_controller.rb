class ReactController < ApplicationController
  before_action :set_context

  ACTIVITIES = [
    TwentyQuestions,
    TwoTruthsOneLie,
    Clicker,
    Experimental
  ]

  def show; end

  private

  def set_context
    @context = {
      user: current_user&.to_h(authenticated: true),
      group: current_group&.to_h,
      all_activities: ACTIVITIES.map(&:to_h),
    }
  end
end
