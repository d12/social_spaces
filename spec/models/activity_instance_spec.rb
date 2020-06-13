require 'rails_helper'

describe ActivityInstance do
  describe "#validations" do
    describe "activity_state_data should be valid JSON" do
      context "when not valid JSON" do
        it "fails validation" do
          instance1 = ActivityInstance.new(activity_state_data: "")
          instance1.save

          instance2 = ActivityInstance.new(activity_state_data: "{hello}")
          instance2.save

          expect(instance1.errors[:activity_state_data].size).to eq(1)
          expect(instance2.errors[:activity_state_data].size).to eq(1)
        end
      end

      context "when not provided" do
        it "passes validation" do
          instance = ActivityInstance.new
          instance.save

          expect(instance.errors[:activity_state_data].size).to eq(0)
        end
      end

      context "when valid JSON" do
        it "passes validation" do
          instance = ActivityInstance.new(activity_state_data: "{\"hello\": 5}")
          instance.save

          expect(instance.errors[:activity_state_data].size).to eq(0)
        end
      end
    end
  end
end
