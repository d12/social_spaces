class AddDrawEventBatches < ActiveRecord::Migration[6.0]
  def change
    drop_table :draw_it_draw_events

    create_table :draw_it_draw_event_batches do |t|
      t.integer :activity_instance_id
      t.json :draw_data

      t.index :activity_instance_id
      t.timestamps
    end
  end
end
