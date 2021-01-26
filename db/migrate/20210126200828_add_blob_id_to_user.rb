class AddBlobIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :blob_id, :integer
  end
end
