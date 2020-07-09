class RemoveUnusedGoogleColumns < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :token
    remove_column :users, :refresh_token
  end
end
