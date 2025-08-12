module Types
  class TransactionType < Types::BaseObject
    field :id, ID, null: false
    field :account_id, ID, null: false
    field :budget_category_id, ID, null: true
    field :amount_cents, Integer, null: false
    field :occurred_on, GraphQL::Types::ISO8601Date, null: false
    field :memo, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :account, Types::AccountType, null: false
    field :budget_category, Types::BudgetCategoryType, null: true
    
    field :amount, Float, null: false
    def amount
      object.amount_cents / 100.0
    end
  end
end
