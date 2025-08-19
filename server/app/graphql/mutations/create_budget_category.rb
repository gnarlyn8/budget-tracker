module Mutations
  class CreateBudgetCategory < BaseMutation
    argument :name, String, required: true
    argument :amount, Float, required: true
    argument :description, String, required: false
    argument :category_type, String, required: false

    field :budget_category, Types::BudgetCategoryType, null: true
    field :errors, [String], null: false

    def resolve(name:, amount:, description: nil, category_type: 'variable_expense')
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"
      
      budget_category = BudgetCategory.new(
        name: name,
        amount: amount,
        description: description,
        category_type: category_type,
        user: user
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
