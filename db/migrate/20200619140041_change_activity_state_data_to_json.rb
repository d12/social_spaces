class ChangeActivityStateDataToJson < ActiveRecord::Migration[6.0]
  def change
    remove_column :activity_instances, :activity_state_data
    add_column :activity_instances, :activity_state_data, :json
  end
end
