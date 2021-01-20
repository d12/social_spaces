class UsersController < ApplicationController
  def create_guest
    if current_user
      head 403 && return
    elsif guest_name.empty?
      head 400 && return
    end

    user = User.create!(name: guest_name, guest: true)
    session[:guest_user_id] = user.id

    session[:join_group_after_auth] = group_key

    redirect_to react_path
  end

  private

  def guest_name
    params["name"]
  end

  def group_key
    params["groupKey"]
  end
end