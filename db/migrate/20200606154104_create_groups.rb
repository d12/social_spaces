class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :key, null: false
      t.timestamps
    end
  end
end
