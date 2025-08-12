module Mutations
  class UpdateAccount < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :account_type, String, required: false
    argument :starting_balance, Float, required: false

    field :account, Types::AccountType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      account = Account.find(id)
      
      # Convert starting_balance to cents if provided
      if attributes[:starting_balance]
        attributes[:starting_balance_cents] = (attributes.delete(:starting_balance) * 100).round
      end

      if account.update(attributes.compact)
        {
          account: account,
          errors: []
        }
      else
        {
          account: nil,
          errors: account.errors.full_messages
        }
      end
    rescue ActiveRecord::RecordNotFound
      {
        account: nil,
        errors: ["Account not found"]
      }
    end
  end
end
