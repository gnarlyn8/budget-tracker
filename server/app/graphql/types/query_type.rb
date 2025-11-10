# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    field :accounts, [Types::AccountType], null: false,
    description: "Returns a list of accounts"

    def accounts
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"
      user.accounts.includes(:transactions)
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "User not found: #{e.message}"
      raise GraphQL::ExecutionError, "Please log in again."
    rescue ActiveRecord::StatementInvalid => e
      Rails.logger.error "Database error: #{e.message}"
      raise GraphQL::ExecutionError, "Unable to load accounts. Please try again later."
    rescue => e
      Rails.logger.error "Unexpected error loading accounts: #{e.message}"
      raise GraphQL::ExecutionError, "Unable to load accounts. Please try again later."
    end

    field :account, Types::AccountType, null: true do
      argument :id, ID, required: true
    end

    def account(id:)
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"
      user.accounts.includes(transactions: :budget_category).find(id)
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Account not found"
    end

    field :budget_categories, [Types::BudgetCategoryType], null: false,
      description: "Returns a list of budget categories"

    def budget_categories
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"
      user.budget_categories.includes(transactions: :account).all
    end

    field :budget_category, Types::BudgetCategoryType, null: true do
      argument :id, ID, required: true
    end

    def budget_category(id:)
      BudgetCategory.includes(transactions: :account).find(id)
    end

    field :transactions, [Types::TransactionType], null: false,
      description: "Returns a list of transactions"

    def transactions
      Transaction.includes(:account, :budget_category).all
    end
  end
end
