class CreateRoomMemberships < ActiveRecord::Migration[6.0]
  def change
    create_table :room_memberships do |t|
      t.references :user, foreign_key: true
      t.references :activity_room, foreign_key: true
      t.timestamps
    end
  end
end
