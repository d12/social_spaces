class RemoveDrawEventBatchesTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :draw_it_draw_event_batches
  end
end
