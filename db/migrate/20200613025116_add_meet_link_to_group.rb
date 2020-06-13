class AddMeetLinkToGroup < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :meet_url, :string
  end
end
