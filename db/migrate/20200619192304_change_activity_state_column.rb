class ChangeActivityStateColumn < ActiveRecord::Migration[6.0]
  def change
    rename_column :activity_instances, :activity_state_data, :state
  end
end
