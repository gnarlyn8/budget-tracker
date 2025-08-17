module Mutations
  class DeleteBudgetCategory < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      budget_category = BudgetCategory.find(id)
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"

      if budget_category.user != user
        raise GraphQL::ExecutionError, "Unauthorized"
      end

      if budget_category.destroy
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: budget_category.errors.full_messages
        }
      end
    rescue ActiveRecord::RecordNotFound
      {
        success: false,
        errors: ["Budget category not found"]
      }
    end
  end
end
