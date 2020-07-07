require 'rails_helper'

RSpec.describe "Activities", type: :request do
  describe "#index" do
    context "when the user is not logged in" do
      it "redirects to the Google oauth page" do
        get groups_path
        expect(response).to redirect_to(user_google_oauth2_omniauth_authorize_path)
      end
    end

    context "when the user is logged in" do
      let!(:user) { User.create(name: "name", email: "email") }

      before do
        login_as(user)
      end

      it "renders the page" do
        get(groups_path)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
