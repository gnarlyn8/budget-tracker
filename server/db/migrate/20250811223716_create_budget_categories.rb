class CreateBudgetCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :budget_categories do |t|
      t.references :budget, null: false, foreign_key: true
      t.string :name
      t.decimal :amount
      t.text :description

      t.timestamps
    end
  end
end
