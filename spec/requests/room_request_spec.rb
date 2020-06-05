require 'rails_helper'

RSpec.describe "Rooms", type: :request do
  describe "#index" do
    context "when the user is not logged in" do
      it "redirects to the Google oauth page" do
        get root_path
        expect(response).to redirect_to("/auth/google_oauth2")
      end
    end

    context "when the user is logged in" do
      let!(:user) { User.create(name: "name", email: "email") }

      before do
        login_as(user)
      end

      it "renders the page" do
        get(root_path)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
