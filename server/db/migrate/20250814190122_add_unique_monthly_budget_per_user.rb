class AddUniqueMonthlyBudgetPerUser < ActiveRecord::Migration[8.0]
  def change
    add_index :accounts, :user_id, unique: true,
      where: "account_type = 'monthly_budget'",
      name: "idx_accounts_one_monthly_budget_per_user"

    change_column_null :accounts, :user_id, false
  end
end
