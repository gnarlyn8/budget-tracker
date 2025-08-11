module Mutations
  class CreateTransaction < BaseMutation
    argument :budget_category_id, ID, required: true
    argument :description, String, required: true
    argument :amount, Float, required: true
    argument :date, GraphQL::Types::ISO8601DateTime, required: false

    field :transaction, Types::TransactionType, null: true
    field :errors, [String], null: false

    def resolve(budget_category_id:, description:, amount:, date: nil)
      budget_category = BudgetCategory.find(budget_category_id)
      transaction = budget_category.transactions.build(
        description: description,
        amount: amount,
        date: date || Date.current
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
