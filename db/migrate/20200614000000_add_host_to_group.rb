class AddHostToGroup < ActiveRecord::Migration[6.0]
  def change
    add_column :group_memberships, :host, :boolean
  end
end
