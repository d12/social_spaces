class CreateActivityInstances < ActiveRecord::Migration[6.0]
  def change
    create_table :activity_instances do |t|
      t.references :group, foreign_key: true
      t.integer :status
      t.string :activity
      t.string :activity_state_data
      t.timestamps
    end
  end
end
