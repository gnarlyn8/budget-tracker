# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_budget, mutation: Mutations::CreateBudget
  end
end
