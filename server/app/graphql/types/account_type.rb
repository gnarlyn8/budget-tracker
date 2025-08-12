module Types
  class AccountType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :account_type, String, null: false
    field :starting_balance_cents, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :transactions, [Types::TransactionType], null: false
    
    field :starting_balance, Float, null: false
    def starting_balance
      object.starting_balance_cents / 100.0
    end
    
    field :current_balance, Float, null: false
    def current_balance
      balance_cents = object.starting_balance_cents + object.transactions.sum(:amount_cents)
      balance_cents / 100.0
    end
  end
end
