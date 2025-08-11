class RemoveAmountFromBudgets < ActiveRecord::Migration[8.0]
  def change
    remove_column :budgets, :amount, :decimal
  end
end
