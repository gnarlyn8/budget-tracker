module Mutations
  class CreateBudgetCategory < BaseMutation
    argument :budget_id, ID, required: true
    argument :name, String, required: true
    argument :amount, Float, required: true
    argument :description, String, required: false

    field :budget_category, Types::BudgetCategoryType, null: true
    field :errors, [String], null: false

    def resolve(budget_id:, name:, amount:, description: nil)
      budget = Budget.find(budget_id)
      budget_category = budget.budget_categories.build(
        name: name,
        amount: amount,
        description: description
      )

      if budget_category.save
        {
          budget_category: budget_category,
          errors: []
        }
      else
        {
          budget_category: nil,
          errors: budget_category.errors.full_messages
        }
      end
    end
  end
end
