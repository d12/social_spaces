class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_from broadcasting_key

    if(activity = user.group.activity)
      activity.process_message({ event: "user_joined", user_id: user.id })
    end
  end

  private

  def user
    @user ||= User.find(params[:user_id])
  end

  def broadcasting_key
    "user_#{params[:user_id]}"
  end

  def self.broadcasting_key(user_id)
    "user_#{user_id}"
  end
end
