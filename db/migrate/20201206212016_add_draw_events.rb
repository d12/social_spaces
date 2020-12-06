class AddDrawEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :draw_it_draw_events do |t|
      t.integer :activity_instance_id
      t.json :draw_data

      t.index :activity_instance_id
      t.timestamps
    end
  end
end
