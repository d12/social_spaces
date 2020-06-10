require "rails_helper"

describe GroupMembership do
  let(:user) { User.create(name: "n", email: "e") }
  let(:group) { Group.create(key: "hello") }

  describe "validations" do
    it "auto-creates a key" do
      group = Group.create
      expect(group.key).to be_truthy
    end

    it "is valid if key is present" do
      group = Group.create(key: "foo")
      expect(group.key).to eq("foo")
    end

    it "can accept users" do
      expect(Group.new(key: "foo", users: [user]).valid?).to be_truthy
    end
  end
end
