module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      unless user = User.from_jwt(@request.params[:t])
        reject_unauthorized_connection
      end

      user
    end
  end
end
