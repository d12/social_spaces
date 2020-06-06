require_relative "../rails_helper"

describe VideoCall do
  describe "validations" do
    it "is invalid if no URL is present" do
      expect(VideoCall.new(timeout_in_days: 2).valid?).to be_falsey
    end

    it "is invalid if no timeout_in_days is present" do
      expect(VideoCall.new(url: "https://google.com").valid?).to be_falsey
    end

    it "is valid if all required attributes are passed" do
      expect(VideoCall.new(timeout_in_days: 2, url: "https://google.com").valid?).to be_truthy
    end

    it "succesfully creates a VideoCall if validations pass" do
      video_call = VideoCall.new(timeout_in_days: 2, url: "https://google.com")
      expect(video_call.save).to be_truthy
    end
  end

  describe "#activity_room" do
    context "when not used by an activity room" do
      it "returns nil" do
        video_call = VideoCall.create(timeout_in_days: 2, url: "https://google.com")
        expect(video_call.activity_room).to be_nil
      end
    end

    context "when used by an activity room" do
      it "returns the activity room" do
        video_call = VideoCall.create(timeout_in_days: 2, url: "https://google.com")
        room = ActivityRoom.create(activity_slug: "chat", video_call_id: video_call.id)

        expect(video_call.activity_room).to eq(room)
      end
    end
  end
end
