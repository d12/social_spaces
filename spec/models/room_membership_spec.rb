require "rails_helper"

describe RoomMembership do
  let(:user) { User.create(name: "n", email: "e") }
  let(:activity_room) { ActivityRoom.new(activity_slug: "chat") }
  describe "validations" do
    it "is invalid if room and user are not present" do
      expect(RoomMembership.new.valid?).to be_falsey
      expect(RoomMembership.new(user: user).valid?).to be_falsey
      expect(RoomMembership.new(activity_room: activity_room).valid?).to be_falsey
    end

    it "is valid if both room and user are present" do
      expect(RoomMembership.new(user: user, activity_room: activity_room).valid?).to be_truthy
    end
  end
end
