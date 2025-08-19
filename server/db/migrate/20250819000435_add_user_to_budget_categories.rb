class AddUserToBudgetCategories < ActiveRecord::Migration[8.0]
  def change
    add_reference :budget_categories, :user, null: true, foreign_key: true
    
    if User.exists?
      first_user = User.first
      BudgetCategory.where(user_id: nil).update_all(user_id: first_user.id)
    end
    
    change_column_null :budget_categories, :user_id, false
  end
end
