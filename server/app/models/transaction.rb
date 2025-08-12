class Transaction < ApplicationRecord
  belongs_to :account
  belongs_to :budget_category, optional: true
end
