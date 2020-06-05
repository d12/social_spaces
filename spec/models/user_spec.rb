require_relative "../rails_helper"

describe User do
  describe ".from_omniauth" do
    let(:omniauth) { double }

    context "when the user does not exist" do
      it "creates and returns a new user" do
        email = "email@email.email"
        name = "Bob"

        allow(omniauth).to receive_message_chain(:info, :email).and_return(email)
        allow(omniauth).to receive_message_chain(:info, :name).and_return(name)

        user = nil
        expect {
          user = User.from_omniauth(omniauth)
        }.to change(User, :count).by(1)

        expect(user.email).to eq(email)
        expect(user.name).to eq(name)
      end
    end

    context "when the omniauth object does not exist" do
      it "returns nil" do
        expect(User.from_omniauth(nil)).to be_nil
      end
    end

    context "when the user exists" do
      it "returns the correct user and does not create a new user" do
        email = "foo@bar.com"
        name = "My Name"

        allow(omniauth).to receive_message_chain(:info, :email).and_return(email)
        allow(omniauth).to receive_message_chain(:info, :name).and_return(name)

        User.create(email: email, name: name)

        user = nil
        expect {
          user = User.from_omniauth(omniauth)
        }.to change(User, :count).by(0)

        expect(user.email).to eq(email)
        expect(user.name).to eq(name)
      end
    end
  end
end
