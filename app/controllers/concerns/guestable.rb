module Guestable
  extend ActiveSupport::Concern

  def current_user
    super || User.find_by(id: session[:guest_user_id], guest: true)
  end
end