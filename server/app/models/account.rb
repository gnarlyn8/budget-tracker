class Account < ApplicationRecord
  has_many :transactions

  enum :account_type, 
    { monthly_budget: "monthly_budget", loan: "loan"}, 
    prefix: :type

  validate :only_one_monthly_budget

  private

  def only_one_monthly_budget
    if account_type == "monthly_budget" && Account.where(account_type: "monthly_budget").where.not(id: id).exists?
      errors.add(:account_type, "Only one monthly budget account is allowed")
    end
  end
end