class BudgetCategory < ApplicationRecord
  belongs_to :budget
  has_many :transactions, dependent: :destroy
  
  enum :category_type, {
    variable_expense: 'variable_expense',
    debt_repayment: 'debt_repayment',
  }
end
