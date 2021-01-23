class AddUserInteractionTracker < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :last_five_interactions, :datetime, null: false, array: true, default: []
  end
end
