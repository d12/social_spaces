module Api
  class GroupsController < ApiController
    USER_IN_GROUP_MESSAGE = "User is already in a group.".freeze

    def show
      unless group = Group.find_by(key: params[:key])
        render json: { errors: ["Could not find group #{params[:key]}"] }
        return
      end

      render json: group.to_h, status: 200
    end

    def create
      if current_user.group
        render json: { errors: [USER_IN_GROUP_MESSAGE] }, status: 400
        return
      end

      group = Group.create(users: [current_user])
      render json: group.to_h, status: 201
    end

    def join
      if current_user.group
        render json: { errors: [USER_IN_GROUP_MESSAGE] }, status: 400
        return
      end

      unless group = Group.find_by(key: params[:groupKey])
        render json: { errors: ["Could not find group #{params[:groupKey]}"] }
        return
      end

      current_user.update(group_id: group.id)

      render json: group.to_h, status: 200
    end

    def leave
      current_user.update!(group_id: nil)

      render json: {}, status: 200
    end
  end
end
