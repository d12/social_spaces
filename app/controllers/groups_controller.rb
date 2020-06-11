class GroupsController < ApplicationController
  def index; end

  def create
    @group = Group.create

    session[:group_id] = @group.id
    GroupMembership.create(group_id: @group.id, user_id: current_user.id)

    redirect_to activities_path
  end

  def join
    @group = Group.find_by(key: params["group_key"])
    unless @group
      flash[:error] = "Group not found! Did you type the group key correctly?"
      redirect_to groups_path
      return
    end

    session[:group_id] = @group.id
    GroupMembership.create(group_id: @group.id, user_id: current_user.id)

    redirect_to activities_path
  end

  def leave
    GroupMembership.find_by(group_id: current_group.id, user_id: current_user.id)&.destroy

    session[:group_id] = nil

    redirect_to groups_path
  end
end
