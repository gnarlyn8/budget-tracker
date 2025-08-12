# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_account, mutation: Mutations::CreateAccount
    field :create_budget_category, mutation: Mutations::CreateBudgetCategory
    field :create_transaction, mutation: Mutations::CreateTransaction
  end
end
