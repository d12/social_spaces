require "rails_helper"

describe User do
  describe ".from_omniauth" do
    let(:omniauth) { double }

    context "when the user does not exist" do
      it "creates and returns a new user" do
        allow(omniauth).to receive_message_chain(:uid).and_return("uid")
        allow(omniauth).to receive_message_chain(:provider).and_return("Google")
        allow(omniauth).to receive_message_chain(:info, :email).and_return("email@email.email")
        allow(omniauth).to receive_message_chain(:info, :name).and_return("Bob")
        allow(omniauth).to receive_message_chain(:credentials, :token).and_return("A")
        allow(omniauth).to receive_message_chain(:credentials, :expires).and_return(true)
        allow(omniauth).to receive_message_chain(:credentials, :expires_at).and_return(5)
        allow(omniauth).to receive_message_chain(:credentials, :refresh_token).and_return("A")

        expect {
          User.from_omniauth(omniauth)
        }.to change(User, :count).by(1)
      end
    end

    context "when the omniauth object does not exist" do
      it "returns nil" do
        expect(User.from_omniauth(nil)).to be_nil
      end
    end

    context "when the user exists" do
      it "returns the correct user and does not create a new user" do
        allow(omniauth).to receive_message_chain(:uid).and_return("uid")
        allow(omniauth).to receive_message_chain(:provider).and_return("Google")
        allow(omniauth).to receive_message_chain(:info, :email).and_return("foo@bar.com")
        allow(omniauth).to receive_message_chain(:info, :name).and_return("My Name")
        allow(omniauth).to receive_message_chain(:credentials, :token).and_return("A")
        allow(omniauth).to receive_message_chain(:credentials, :expires).and_return(true)
        allow(omniauth).to receive_message_chain(:credentials, :expires_at).and_return(5)
        allow(omniauth).to receive_message_chain(:credentials, :refresh_token).and_return("A")


        User.create(provider: "Google", uid: "uid", email: "foo@bar.com", name: "name")

        user = nil
        expect {
          user = User.from_omniauth(omniauth)
        }.to change(User, :count).by(0)

        expect(user.provider).to eq("Google")
        expect(user.uid).to eq("uid")
      end
    end
  end
end
