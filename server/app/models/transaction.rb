class Transaction < ApplicationRecord
  belongs_to :account
  belongs_to :budget_category, optional: true

  validates :memo, presence: true
  validates :amount_cents, presence: true, numericality: { other_than: 0 }
end
