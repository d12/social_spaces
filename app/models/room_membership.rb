class RoomMembership < ApplicationRecord
  belongs_to :user, required: true
  belongs_to :activity_room, required: true
end
