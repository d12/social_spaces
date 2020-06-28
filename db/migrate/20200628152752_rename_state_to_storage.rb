class RenameStateToStorage < ActiveRecord::Migration[6.0]
  def change
    rename_column :activity_instances, :state, :storage
  end
end
