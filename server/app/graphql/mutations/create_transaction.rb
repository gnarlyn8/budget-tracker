module Mutations
  class CreateTransaction < BaseMutation
    argument :account_id, ID, required: true
    argument :budget_category_id, ID, required: false
    argument :memo, String, required: true
    argument :amount, Float, required: true
    argument :occurred_on, GraphQL::Types::ISO8601Date, required: false

    field :transaction, Types::TransactionType, null: true
    field :errors, [String], null: false

    def resolve(account_id:, memo:, amount:, budget_category_id: nil, occurred_on: nil)
      account = Account.find(account_id)
      budget_category = budget_category_id ? BudgetCategory.find(budget_category_id) : nil
      
      transaction = Transaction.new(
        account: account,
        budget_category: budget_category,
        memo: memo,
        amount_cents: (amount * 100).round,
        occurred_on: occurred_on || Date.current
      )

      if transaction.save
        {
          transaction: transaction,
          errors: []
        }
      else
        {
          transaction: nil,
          errors: transaction.errors.full_messages
        }
      end
    end
  end
end
