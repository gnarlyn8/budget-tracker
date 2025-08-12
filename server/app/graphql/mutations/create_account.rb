module Mutations
  class CreateAccount < BaseMutation
    argument :name, String, required: true
    argument :account_type, String, required: true
    argument :starting_balance, Float, required: false

    field :account, Types::AccountType, null: true
    field :errors, [String], null: false

    def resolve(name:, account_type:, starting_balance: 0.0)
      account = Account.new(
        name: name,
        account_type: account_type,
        starting_balance_cents: (starting_balance * 100).round
      )

      if account.save
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
    end
  end
end
