class MakeBudgetCategoryNullableForTransactions < ActiveRecord::Migration[8.0]
  def change
    change_column_null :transactions, :budget_category_id, true
  end
end
