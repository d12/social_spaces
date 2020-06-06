class CreateVideoCalls < ActiveRecord::Migration[6.0]
  def change
    create_table :video_calls do |t|
      t.string :url, null: false
      t.integer :timeout_in_days, null: false
      t.timestamps
    end
  end
end
