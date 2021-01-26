class RemoveStatusFromActivityInstance < ActiveRecord::Migration[6.0]
  def change
    remove_column :activity_instances, :status
  end
end
