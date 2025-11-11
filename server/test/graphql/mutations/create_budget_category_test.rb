require "test_helper"

module Mutations
  class CreateBudgetCategoryTest < ActiveSupport::TestCase
    def setup
      @user = users(:one)
      @budget_category = budget_categories(:one)
    end

    def test_creates_budget_category_with_valid_attributes
      assert_difference("BudgetCategory.count", 1) do
        result = execute_mutation(input: budget_category_input(@budget_category))
        payload = result["data"]["createBudgetCategory"]
        budget_category = payload["budgetCategory"]

        assert_equal [], payload["errors"]
        assert_equal @budget_category.name, budget_category["name"]
        assert_equal @budget_category.amount, budget_category["amount"]
        assert_equal @budget_category.description, budget_category["description"]
        assert_equal @budget_category.category_type, budget_category["categoryType"]
      end
    end

    def test_requires_authenticated_user
      result = execute_mutation(input: budget_category_input(@budget_category), context: {})
      assert_nil result["data"]["createBudgetCategory"]
      error_messages = result["errors"].pluck("message")
      assert_includes error_messages, "Unauthorized"
    end

    def test_returns_validation_errors_for_empty_name
      assert_no_difference("BudgetCategory.count") do
        input = budget_category_input(@budget_category).merge(name: "")
        result = execute_mutation(input: input)
        payload = result["data"]["createBudgetCategory"]

        assert_nil payload["budgetCategory"]
        assert_not_empty payload["errors"]
        assert_includes payload["errors"], "Name can't be blank"
      end
    end

    def test_returns_validation_errors_for_negative_amount
      assert_no_difference("BudgetCategory.count") do
        input = budget_category_input(@budget_category).merge(amount: -100.0)
        result = execute_mutation(input: input)
        payload = result["data"]["createBudgetCategory"]

        assert_nil payload["budgetCategory"]
        assert_not_empty payload["errors"]
        assert_includes payload["errors"], "Amount must be greater than 0"
      end
    end

    private
    
    def budget_category_input(budget_category)
      {
        name: budget_category.name,
        amount: budget_category.amount,
        description: budget_category.description,
        categoryType: budget_category.category_type
      }
    end

    def execute_mutation(input:, context: { current_user: @user })
      ServerSchema.execute(
        mutation,
        variables: { input: input },
        context: context
      )
    end

    def mutation
      <<~GRAPHQL
        mutation($input: CreateBudgetCategoryInput!) {
          createBudgetCategory(input: $input) {
            budgetCategory {
              name
              amount
              description
              categoryType
            }
            errors
          }
        }
      GRAPHQL
    end
  end
end