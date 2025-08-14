class AddUserToAccounts < ActiveRecord::Migration[8.0]
  def up
    add_reference :accounts, :user, null: true, foreign_key: true
  end

  def down
    remove_reference :accounts, :user, foreign_key: true
  end
end
