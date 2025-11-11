require "test_helper"

module Queries
  class AccountsTest < ActiveSupport::TestCase
    def setup
      @user = users(:one)
      @account = accounts(:loan)
    end

    def test_returns_accounts_when_found
      result = execute_query
      accounts = result["data"]["accounts"]

      assert_not_nil accounts
      assert_equal @user.accounts.count, accounts.count
      
      account_data = accounts.find { |a| a["name"] == "Loan" }
      assert_not_nil account_data
      assert_equal "loan", account_data["accountType"]
      assert_equal @account.starting_balance_cents, account_data["startingBalanceCents"]
      assert_kind_of Array, account_data["transactions"]
    end

    private

    def execute_query(context: { current_user: @user })
      ServerSchema.execute(
        query,
        variables: {},
        context: context
      )
    end

    def query
      <<~GRAPHQL
        query {
          accounts {
            id
            name
            accountType
            startingBalanceCents
            transactions {
              id
              amount
              occurredOn
              memo
              createdAt
              updatedAt
              budgetCategory {
                id
                name
                categoryType
              }
            }
          }
        }
      GRAPHQL
    end
  end
end