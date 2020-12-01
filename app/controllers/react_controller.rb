class ReactController < ApplicationController
  ACTIVITIES = [
    TwoTruthsOneLie,
    Clicker,
  ]

  def show
    if current_group && group_key
      # Redirect user to / if they're already in a group.
      # React wouldn't care, this is more to not confuse the user if they try to join
      # a new group while in a group already
      redirect_to react_path
      return
    end

    add_user_to_group_after_auth
    set_context
  end

  private

  def group_key
    params["room_key"]
  end

  def add_user_to_group_after_auth
    key = session[:join_group_after_auth] || group_key

    if !current_group &&
      current_user &&
      key &&
      group = Group.find_by(key: key)

      group.add_user(current_user)
    end

    session[:join_group_after_auth] = nil
  end

  def set_context
    @context = {
      group_key: group_key, # Used when unauthenticated, to redirect to group after login
      user: current_user&.to_h(authenticated: true),
      group: current_group&.to_h,
      all_activities: ACTIVITIES.map(&:to_h),
    }
  end
end
