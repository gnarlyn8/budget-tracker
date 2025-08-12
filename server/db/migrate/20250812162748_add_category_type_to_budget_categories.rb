class AddCategoryTypeToBudgetCategories < ActiveRecord::Migration[8.0]
  def change
    add_column :budget_categories, :category_type, :string, null: false, default: 'variable_expense'
    add_index :budget_categories, :category_type
  end
end
