require "rails_helper"

class BadActivity < Activity
end

class GoodActivity < Activity
  class << self
    def display_name
      "Good"
    end

    def max_users
      3
    end
  end
end

describe Activity do
  context "when subclass does not implement methods" do
    it "raises" do
      expect { BadActivity.display_name }.to raise_error(Activity::NotSubclassedError)
      expect { BadActivity.max_users }.to raise_error(Activity::NotSubclassedError)
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
