module Api
  class GroupsController < ApiController
    def create
      if current_user.group
        render json: { errors: ["User is already in a group"] }, status: 400
        return
      end

      group = Group.create(users: [current_user])
      render json: group.to_h, status: 201
    end
  end
end
