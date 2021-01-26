class AddJoinedGroupAt < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :joined_group_at, :datetime
    add_index :users, :joined_group_at
  end
end
