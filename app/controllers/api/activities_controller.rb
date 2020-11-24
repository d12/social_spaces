module Api
  class ActivitiesController < ApiController
    def start
      result = StartActivityService.new(
        activity: params[:activity],
        group: current_user.group,
        actor: current_user
      ).call

      unless result.succeeded?
        render json: { errors: result.errors }
        return
      end

      render json: result.instance.group.to_h, status: 201
    end

    def end
      unless group = Group.find_by(key: params[:groupKey])
        render json: { errors: ["Could not find group #{params[:group_key]}"] }
        return
      end

      unless current_user.id == group.host_id
        render json: { errors: ["Only the host can end an activity"] }
        return
      end

      group.activity.end_activity(reason: "The host has ended the activity.")

      render json: {}, status: 200
    end
  end
end
