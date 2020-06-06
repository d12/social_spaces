require "rails_helper"

class BadActivity < BaseActivity
end

class GoodActivity < BaseActivity
  class << self
    def display_name
      "Good"
    end

    def max_users
      3
    end
  end
end

describe BaseActivity do
  context "when subclass does not implement methods" do
    it "raises" do
      expect { BadActivity.display_name }.to raise_error(BaseActivity::NotSubclassedError)
      expect { BadActivity.max_users }.to raise_error(BaseActivity::NotSubclassedError)
    end
  end

  context "when subclass implements correct methods" do
    it "does not raise on implemented methods" do
      expect(GoodActivity.display_name).to eq("Good")
      expect(GoodActivity.max_users).to eq(3)
    end

    it "returns a valid slug" do
      expect(GoodActivity.slug).to eq("good_activity")
    end
  end
end
