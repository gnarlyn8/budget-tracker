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
      if object.account_type == "monthly_budget"
        total_transaction_cents = object.transactions.sum(:amount_cents)
        balance_cents = object.starting_balance_cents + total_transaction_cents
      else
        total_transaction_cents = object.transactions.sum(:amount_cents)
        balance_cents = object.starting_balance_cents + total_transaction_cents
      end
      
      balance_cents / 100.0
    end
  end
end
