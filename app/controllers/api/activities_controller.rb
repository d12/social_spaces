module Api
  class ActivitiesController < ApiController
    def start
      result = StartActivityService.new(
        activity: params[:activity],
        group: current_user.group,
        actor: current_user
      ).call

      if result.errors
        render json: { errors: result.errors }
        return
      end

      render json: result.instance.to_h, status: 201
    end
  end
end
