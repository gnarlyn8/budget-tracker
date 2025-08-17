module Mutations
  class DeleteTransaction < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      transaction = Transaction.find(id)
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"

      if transaction.account.user != user
        raise GraphQL::ExecutionError, "Unauthorized"
      end

      if transaction.destroy
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: transaction.errors.full_messages
        }
      end
    rescue ActiveRecord::RecordNotFound
      {
        success: false,
        errors: ["Transaction not found"]
      }
    end
  end
end
