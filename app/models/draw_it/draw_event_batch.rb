class DrawIt::DrawEventBatch < ApplicationRecord
  self.table_name = "draw_it_draw_event_batches"

  belongs_to :activity_instance
end
