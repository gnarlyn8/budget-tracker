class Budget < ApplicationRecord
  has_many :transactions, dependent: :destroy
end
