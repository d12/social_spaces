require 'rails_helper'

RSpec.describe "Groups", type: :request do
  let(:user) { User.create(name: "name", email: "email") }

  describe "#create" do
    context "when not logged in" do
      it "redirects you to the google oauth page" do
        post groups_path
        expect(response).to redirect_to("/auth/google_oauth2")
      end
    end

    context "when logged in" do
      before do
        login_as(user)
      end

      it "creates a group" do
        expect {
          post groups_path
        }.to change(Group, :count).by(1)
      end

      it "redirects to activities index" do
        post groups_path
        expect(response).to redirect_to(activities_path)
      end
    end
  end

  describe "#join" do
    context "when not logged in" do
      it "redirects you to the google oauth page" do
        get join_group_path("AAAAAA")
        expect(response).to redirect_to("/auth/google_oauth2")
      end
    end

    context "when logged in" do
      before do
        login_as(user)
      end

      context "when group key is valid" do
        let!(:group) { Group.create(key: "AAAAAA") }

        it "adds user to the group" do
          get join_group_path("AAAAAA")
          expect(group.users.first).to eq(user)
        end

        it "redirects to the activities page" do
          get join_group_path("AAAAAA")
          expect(response).to redirect_to(activities_path)
        end
      end

      context "when group key is invalid" do
        it "does not add the user to any group" do
          get join_group_path("BBBBBB")
          expect(user.groups).to be_empty
        end

        it "redirects to group index" do
          get join_group_path("BBBBBB")
          expect(response).to redirect_to(groups_path)
        end

        it "sets a flash error" do
          get join_group_path("BBBBBB")
          expect(flash[:error]).to be_present
        end
      end
    end
  end
end
