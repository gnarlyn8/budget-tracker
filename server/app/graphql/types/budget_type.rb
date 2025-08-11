module Types
  class BudgetType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :budget_categories, [Types::BudgetCategoryType], null: false
    field :total_amount, Float, null: false

    def total_amount
      object.budget_categories.sum(:amount)
    end
  end
end
