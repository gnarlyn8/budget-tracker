# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_account, mutation: Mutations::CreateAccount
    field :update_account, mutation: Mutations::UpdateAccount
    field :delete_account, mutation: Mutations::DeleteAccount
    field :create_budget_category, mutation: Mutations::CreateBudgetCategory
    field :delete_budget_category, mutation: Mutations::DeleteBudgetCategory
    field :create_transaction, mutation: Mutations::CreateTransaction
    field :delete_transaction, mutation: Mutations::DeleteTransaction
  end
end
