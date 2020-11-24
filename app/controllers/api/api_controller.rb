module Api
  class ApiController < ActionController::API
    before_action :ensure_user_is_authenticated

    private

    def ensure_user_is_authenticated
      return if current_user

      render status: 401
    end
  end
end
