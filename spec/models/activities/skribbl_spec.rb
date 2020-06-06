require_relative "../../rails_helper"

describe Activity::Skribbl do
  it "returns the correct display name" do
    expect(described_class.display_name).to eq("Skribbl.io")
  end

  it "returns the correct max players" do
    expect(described_class.max_users).to eq(8)
  end

  it "returns the correct slug" do
    expect(described_class.slug).to eq("skribbl")
  end
end
