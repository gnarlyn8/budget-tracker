module Types
  class BudgetCategoryType < Types::BaseObject
    field :id, ID, null: false
    field :budget_id, ID, null: false
    field :name, String, null: false
    field :amount, Float, null: false
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :transactions, [Types::TransactionType], null: false
  end
end
