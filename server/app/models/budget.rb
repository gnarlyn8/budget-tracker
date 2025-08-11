class Budget < ApplicationRecord
  has_many :budget_categories, dependent: :destroy
end
