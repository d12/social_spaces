class CreateActivityRooms < ActiveRecord::Migration[6.0]
  def change
    create_table :activity_rooms do |t|
      t.string :activity_slug, null: false
      t.belongs_to :video_call, index: true
      t.timestamps
    end
  end
end
