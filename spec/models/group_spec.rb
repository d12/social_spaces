require "rails_helper"

describe Group do
  let(:user)   { User.create(name: "n", email: "e") }
  let(:user_2) { User.create(name: "nn", email: "ee") }
  let(:group)  { Group.create(key: "hello") }

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

  describe "host" do
    context "a group with no members" do
      it "has no host" do
        expect(Group.create.host).to be_nil
      end
    end

    context "a group with one member" do
      it "elects the member to be host" do
        group = Group.create(users: [user])
        expect(group.host).to eq(user)
      end
    end

    context "a group with multiple members" do
      it "elects the first joined member to be host" do
        group = Group.create(users: [user, user_2])
        expect(group.host).to eq(user)
      end
    end
  end
end
