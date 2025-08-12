class Account < ApplicationRecord
  has_many :transactions

  enum :account_type, 
    { monthly_budget: "monthly_budget", loan: "loan"}, 
    prefix: :type
end