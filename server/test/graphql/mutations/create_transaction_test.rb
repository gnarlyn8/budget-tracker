require "test_helper"

module Mutations
  class CreateTransactionTest < ActiveSupport::TestCase
    def setup
      @user = users(:one)
      @monthly_budget = accounts(:monthly_budget)
      @monthly_budget.update!(user: @user)
      @loan_account = accounts(:loan)
      @loan_account.update!(user: @user)
      @variable_expense_category = budget_categories(:one)
      @variable_expense_category.update!(user: @user)
      @debt_repayment_category = budget_categories(:two)
      @debt_repayment_category.update!(user: @user)
    end

    def test_creates_variable_expense_transaction
      result = execute_mutation(
          account_id: @monthly_budget.id.to_s,
          budget_category_id: @variable_expense_category.id.to_s,
          memo: "Test purchase",
          amount: 50.0
        )

      payload = result["data"]["createTransaction"]
      transaction = payload["transaction"]

      assert_equal [], payload["errors"]
      assert_equal "Test purchase", transaction["memo"]
      assert_equal -50.0, transaction["amount"]
      assert_equal @monthly_budget.id.to_s, transaction["accountId"]
      assert_equal @variable_expense_category.id.to_s, transaction["budgetCategoryId"]
    end

    def test_creates_debt_repayment_transaction
      result = assert_difference("Transaction.count", 2) do
        execute_mutation(
          account_id: @loan_account.id.to_s,
          budget_category_id: @debt_repayment_category.id.to_s,
          memo: "Loan payment",
          amount: 25.0
        )
      end

      payload = result["data"]["createTransaction"]
      transaction = payload["transaction"]

      assert_equal [], payload["errors"]
      assert_equal "Loan payment", transaction["memo"]
      assert_equal -25.0, transaction["amount"]
    end

    def test_creates_transaction_without_category
      result = assert_difference("Transaction.count", 1) do
        execute_mutation(
          account_id: @monthly_budget.id.to_s,
          memo: "Uncategorized expense",
          amount: 30.0
        )
      end

      payload = result["data"]["createTransaction"]
      transaction = payload["transaction"]

      assert_equal [], payload["errors"]
      assert_equal "Uncategorized expense", transaction["memo"]
      assert_equal -30.0, transaction["amount"]
      assert_nil transaction["budgetCategoryId"]
    end

    def test_uses_current_date_when_occurred_on_not_provided
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Test",
        amount: 10.0
      )
      payload = result["data"]["createTransaction"]
      transaction = payload["transaction"]

      assert_equal Date.current.iso8601, transaction["occurredOn"]
    end

    def test_uses_provided_occurred_on_date
      date = 3.days.ago.to_date
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Test",
        amount: 10.0,
        occurred_on: date.iso8601
      )
      payload = result["data"]["createTransaction"]
      transaction = payload["transaction"]

      assert_equal date.iso8601, transaction["occurredOn"]
    end

    def test_requires_authenticated_user
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Test",
        amount: 10.0,
        context: {}
      )
      payload = result["data"]["createTransaction"]

      error_messages = payload["errors"]
      assert_includes error_messages, "No monthly budget account found"
    end

    def test_returns_error_when_no_monthly_budget_exists
      user_without_budget = users(:two)
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Test",
        amount: 10.0,
        context: { current_user: user_without_budget }
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_includes payload["errors"], "No monthly budget account found"
    end

    def test_returns_error_when_insufficient_funds
      @monthly_budget.update!(starting_balance_cents: 1000)
      @monthly_budget.transactions.destroy_all

      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Expensive purchase",
        amount: 20.0
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_not_empty payload["errors"]
      assert_includes payload["errors"].first, "Insufficient funds"
    end

    def test_allows_transaction_when_balance_exactly_zero
      @monthly_budget.update!(starting_balance_cents: 1000)
      @monthly_budget.transactions.destroy_all
      Transaction.create!(
        account: @monthly_budget,
        amount_cents: -1000,
        occurred_on: Date.current,
        memo: "Previous expense"
      )

      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "Test",
        amount: 0.01
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_not_empty payload["errors"]
    end

    def test_returns_error_when_account_not_found
      result = execute_mutation(
        account_id: "999999",
        memo: "Test",
        amount: 10.0
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_not_empty payload["errors"]
    end

    def test_returns_error_when_budget_category_not_found
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        budget_category_id: "999999",
        memo: "Test",
        amount: 10.0
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_not_empty payload["errors"]
    end

    def test_handles_validation_errors
      result = execute_mutation(
        account_id: @monthly_budget.id.to_s,
        memo: "",
        amount: 10.0
      )
      payload = result["data"]&.dig("createTransaction")

      assert_not_nil payload
      assert_nil payload["transaction"]
      assert_not_empty payload["errors"]
      assert_includes payload["errors"], "Memo can't be blank"
    end

    private

    def execute_mutation(account_id:, memo:, amount:, budget_category_id: nil, occurred_on: nil, context: { current_user: @user })
      ServerSchema.execute(
        mutation,
        variables: {
          input: {
            accountId: account_id,
            budgetCategoryId: budget_category_id,
            memo: memo,
            amount: amount,
            occurredOn: occurred_on
          }
        },
        context: context
      )
    end

    def mutation
      <<~GRAPHQL
        mutation($input: CreateTransactionInput!) {
          createTransaction(input: $input) {
            transaction {
              id
              accountId
              budgetCategoryId
              amount
              memo
              occurredOn
            }
            errors
          }
        }
      GRAPHQL
    end
  end
end

