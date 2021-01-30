class ReactController < ApplicationController
  ACTIVITIES = [
    TwoTruthsOneLie,
    Clicker,
    DrawIt,
  ]

  def show
    if is_group_key_parameter_bad?
      redirect_to react_path
      return
    end

    add_user_to_group_after_auth
    set_context
  end

  def test
    sleep 3
    set_context
  end

  private

  def group_key
    params["room_key"]
  end

  def is_group_key_parameter_bad?
    group_key && !Group.find_by(key: group_key)
  end

  def add_user_to_group_after_auth
    key = session[:join_group_after_auth] || group_key
    return unless key

    if current_user && key && (group = Group.find_by(key: key)) && (group != current_user.group)

      # Better UX when you follow an invite link to get removed from your current group and join the new one.
      if(current_user.group)
        current_user.group.remove_user(current_user)
      end

      group.add_user(current_user)
    end

    session[:join_group_after_auth] = nil
  end

  def group_host_name
    Group.find_by(key: group_key)&.host&.name
  end

  def set_context
    @context = {
      group_key: group_key, # Used when unauthenticated, to redirect to group after login
      group_name: group_host_name,
      user: current_user&.to_h(authenticated: true),
      group: current_group&.to_h,
      all_activities: ACTIVITIES.map(&:to_h),
    }
  end
end
