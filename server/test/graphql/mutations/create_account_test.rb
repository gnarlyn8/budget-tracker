require "test_helper"

module Mutations
  class CreateAccountTest < ActiveSupport::TestCase
    def setup
      @user = users(:one)
      @account = accounts(:loan)
    end

    def test_creates_account_with_valid_attributes
      assert_difference("Account.count", 1) do
        result = execute_mutation(input: account_input(@account))
        payload = result["data"]["createAccount"]
        account = payload["account"]

        assert_equal [], payload["errors"]
        assert_equal @account.name, account["name"]
        assert_equal @account.account_type, account["accountType"]
        assert_in_delta @account.starting_balance_cents / 100.0, account["startingBalance"]
      end

      account_record = Account.order(:created_at).last
      assert_equal @account.starting_balance_cents, account_record.starting_balance_cents
      assert_equal @user, account_record.user
    end

    def test_requires_authenticated_user
      result = execute_mutation(input: account_input(@account), context: {})
      assert_nil result["data"]["createAccount"]
      error_messages = result["errors"].map { |error| error["message"] }
      assert_includes error_messages, "Unauthorized"
    end

    def test_returns_validation_errors
      existing_account = accounts(:monthly_budget)
      existing_account.update!(user: @user)

      assert_no_difference("Account.count") do
        result = execute_mutation(input: account_input(existing_account))
        payload = result["data"]["createAccount"]

        assert_nil payload["account"]
        assert_includes payload["errors"], "Account type Only one monthly budget account is allowed per user"
      end
    end

    private

    def account_input(account)
      {
        name: account.name,
        accountType: account.account_type,
        startingBalance: account.starting_balance_cents / 100.0
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
        mutation($input: CreateAccountInput!) {
          createAccount(input: $input) {
            account {
              name
              accountType
              startingBalance
            }
            errors
          }
        }
      GRAPHQL
    end
  end
end

