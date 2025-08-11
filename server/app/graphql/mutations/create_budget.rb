module Mutations
  class CreateBudget < BaseMutation
    argument :name, String, required: true
    argument :amount, Float, required: true
    argument :description, String, required: false

    field :budget, Types::BudgetType, null: true
    field :errors, [String], null: false

    def resolve(name:, amount:, description: nil)
      budget = Budget.new(
        name: name,
        amount: amount,
        description: description
      )

      if budget.save
        {
          budget: budget,
          errors: []
        }
      else
        {
          budget: nil,
          errors: budget.errors.full_messages
        }
      end
    end
  end
end
