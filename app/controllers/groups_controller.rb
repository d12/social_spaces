class GroupsController < ApplicationController
  skip_before_action :redirect_to_activity_if_in_progress, only: [:leave]
  before_action :ensure_not_in_group, only: [:index, :create, :join]

  def index; end

  def create
    @group = Group.create(users: [current_user])

    redirect_to activities_path
  end

  def join
    @group = Group.find_by(key: params["group_key"])
    unless @group
      flash[:alert] = "Group not found! Did you type the group key correctly?"
      redirect_to groups_path
      return
    end
    current_user.update!(group: @group)
    GroupChannel.broadcast_user_joined(@group, current_user)

    redirect_to activities_path
  end

  def leave
    unless current_group
      flash[:warning] = "Cannot leave a group if you're not in a group silly!"
      redirect_to groups_path
      return
    end

    current_group.activity&.disconnect_user(current_user)
    
    current_user.update!(group: nil)

    GroupChannel.broadcast_user_left(current_group, current_user)

    redirect_to groups_path
  end

  private

  def ensure_not_in_group
    if current_group
      redirect_to activities_path
    end
  end
end
