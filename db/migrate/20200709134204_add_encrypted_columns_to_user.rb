class AddEncryptedColumnsToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :token_ciphertext, :text
    add_column :users, :refresh_token_ciphertext, :text
  end
end
