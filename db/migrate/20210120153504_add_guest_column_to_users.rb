class AddGuestColumnToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :guest, :boolean, null: false, default: false
  end
end
