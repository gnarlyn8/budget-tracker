class AddAccountReferenceToTransactions < ActiveRecord::Migration[8.0]
  class Account < ActiveRecord::Base; end
  class Transaction < ActiveRecord::Base
    self.table_name = "transactions"
  end

  def up
    add_reference :transactions, :account, null: true, foreign_key: true
    add_column    :transactions, :amount_cents, :integer, null: true
    add_column    :transactions, :occurred_on, :date, null: true
    add_column    :transactions, :memo, :string
    add_index :transactions, :occurred_on

    cash = Account.find_or_create_by!(name: "Monthly Budget") do |a|
      a.account_type = "monthly_budget"
      a.starting_balance_cents = 0
    end

    Transaction.where(account_id: nil).update_all(account_id: cash.id)

    Transaction.where(memo: nil).find_each do |tx|
      tx.update_columns(memo: tx[:description])
    end

    Transaction.where(amount_cents: nil).find_each do |tx|
      cents    = (tx[:amount].to_d * 100).round if tx[:amount]
      occurred = tx[:date]&.to_date
      tx.update_columns(amount_cents: cents, occurred_on: occurred || Date.current)
    end

    change_column_null :transactions, :account_id,   false
    change_column_null :transactions, :amount_cents, false
    change_column_null :transactions, :occurred_on,  false

    remove_column :transactions, :amount, :decimal
    remove_column :transactions, :date, :datetime
    remove_column :transactions, :description, :string
    remove_column :transactions, :budget_id, :integer
  end

  def down
    add_column :transactions, :amount, :decimal
    add_column :transactions, :date,   :datetime
    add_column :transactions, :description, :string
    add_column :transactions, :budget_id, :integer

    remove_index  :transactions, :occurred_on
    remove_column :transactions, :memo
    remove_column :transactions, :occurred_on
    remove_column :transactions, :amount_cents
    remove_reference :transactions, :account, foreign_key: true
  end
end
