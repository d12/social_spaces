module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user # this checks whether a user is authenticated with devise
      if verified_user = env['warden'].user
        verified_user
      elsif verified_guest = User.find_by(id: @request.session["guest_user_id"], guest: true)
        verified_guest
      else
        reject_unauthorized_connection
      end
    end
  end
end
