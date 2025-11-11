class BudgetCategory < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy
  
  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  
  enum :category_type, {
    variable_expense: 'variable_expense',
    debt_repayment: 'debt_repayment',
  }
end
