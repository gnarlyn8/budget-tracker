module Mutations
  class DeleteAccount < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      account = Account.find(id)
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"

      if account.user != user
        raise GraphQL::ExecutionError, "Unauthorized"
      end

      if account.destroy
        {
          success: true,
          errors: []
        }
      else
        {
          success: false,
          errors: account.errors.full_messages
        }
      end
    rescue ActiveRecord::RecordNotFound
      {
        success: false,
        errors: ["Account not found"]
      }
    end
  end
end
