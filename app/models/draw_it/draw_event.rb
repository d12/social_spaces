class DrawIt::DrawEvent < ApplicationRecord
  self.table_name = "draw_it_draw_events"

  belongs_to :activity_instance
end
