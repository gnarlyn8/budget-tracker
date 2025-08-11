class CreateBudgets < ActiveRecord::Migration[8.0]
  def change
    create_table :budgets do |t|
      t.string :name
      t.decimal :amount
      t.text :description

      t.timestamps
    end
  end
end
