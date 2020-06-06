require "rails_helper"

describe Activity::Chat do
  it "returns the correct display name" do
    expect(described_class.display_name).to eq("Chat")
  end

  it "returns the correct max players" do
    expect(described_class.max_users).to eq(5)
  end

  it "returns the correct slug" do
    expect(described_class.slug).to eq("chat")
  end
end
