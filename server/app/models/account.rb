class Account < ApplicationRecord
  has_many :transactions, dependent: :destroy
  belongs_to :user

  enum :account_type, 
    { monthly_budget: "monthly_budget", loan: "loan"}, 
    prefix: :type

  default_scope { includes(transactions: :budget_category) }
  validates :user, presence: true
  validate :only_one_monthly_budget, if: -> { account_type == "monthly_budget" }


  private

  def only_one_monthly_budget
    return unless user_id
    if Account.where(user_id: user_id, account_type: "monthly_budget").where.not(id: id).exists?
      errors.add(:account_type, "Only one monthly budget account is allowed per user")
    end
  end
end