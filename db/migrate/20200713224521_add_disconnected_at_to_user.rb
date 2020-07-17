class AddDisconnectedAtToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :disconnected_at, :datetime, null: true
    add_index :users, :disconnected_at
  end
end
