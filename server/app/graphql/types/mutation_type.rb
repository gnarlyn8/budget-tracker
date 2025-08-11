# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_budget, mutation: Mutations::CreateBudget
    field :create_transaction, mutation: Mutations::CreateTransaction
  end
end
