module Types
  class AccountType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :account_type, String, null: false
    field :starting_balance_cents, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :transactions, [Types::TransactionType], null: false
    field :user, Types::UserType, null: false
    
    field :starting_balance, Float, null: false
    def starting_balance
      object.starting_balance_cents / 100.0
    end
    
    field :current_balance, Float, null: false
    def current_balance
      if object.account_type == "loan"
        total_transaction_cents = object.transactions.sum(:amount_cents)
        balance_cents = object.starting_balance_cents - total_transaction_cents
      else
        spending_cents = object.transactions.where("amount_cents < 0").sum(:amount_cents)
        balance_cents = object.starting_balance_cents + spending_cents
      end
      
      balance_cents / 100.0
    end

    field :total_spending_or_payments, Float, null: false
    def total_spending_or_payments
      if object.account_type == "loan"
        payments_cents = object.transactions.where("amount_cents > 0").sum(:amount_cents)
        capped_payments_cents = [payments_cents, object.starting_balance_cents].min
        capped_payments_cents / 100.0
      else
        spending_cents = object.transactions.where("amount_cents < 0").sum(:amount_cents).abs
        capped_spending_cents = [spending_cents, object.starting_balance_cents].min
        capped_spending_cents / 100.0
      end
    end
  end
end
