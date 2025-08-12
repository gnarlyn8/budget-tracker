class RemoveBudgetsTable < ActiveRecord::Migration[8.0]
  def change
    if column_exists?(:budget_categories, :budget_id)
      remove_column :budget_categories, :budget_id
    end

    remove_reference :budget_categories, :budget, index: true

    if table_exists?(:budgets)
      drop_table :budgets 
    end
  end
end
