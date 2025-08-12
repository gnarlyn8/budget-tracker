class CreateAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :account_type, null: false
      t.integer :starting_balance_cents, null: false, default: 0

      t.timestamps
    end
  end
end
