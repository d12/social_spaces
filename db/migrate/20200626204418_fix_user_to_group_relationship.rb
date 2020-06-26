class FixUserToGroupRelationship < ActiveRecord::Migration[6.0]
  def change
    drop_table :group_memberships
    add_reference :users, :group, index: true
    add_foreign_key :users, :groups
  end
end
