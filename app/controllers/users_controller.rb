class UsersController < ApplicationController
  def create_guest
    if current_user
      head 403 && return
    elsif guest_name.present?
      u = User.create!(name: guest_name, guest: true)
      session[:guest_user_id] = u.id
      redirect_to react_path
    else
      head 400
      puts "Bad!"
    end
  end

  private

  def guest_name
    params["name"]
  end
end