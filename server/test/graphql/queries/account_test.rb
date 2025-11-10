require "test_helper"

module Queries
  class AccountTest < ActiveSupport::TestCase
    def setup
      @user = users(:one)
      @account = accounts(:loan)
      @account.update!(user: @user)
    end

    def test_returns_account_when_found
      result = execute_query(id: @account.id.to_s)
      account = result["data"]["account"]

      assert_not_nil account
      assert_equal @account.name, account["name"]
      assert_equal @account.account_type, account["accountType"]
      assert_equal @account.starting_balance_cents, account["startingBalanceCents"]
    end

    def test_requires_authenticated_user
      result = execute_query(id: @account.id.to_s, context: {})
      assert_nil result["data"]["account"]
      error_messages = result["errors"].map { |error| error["message"] }
      assert_includes error_messages, "Unauthorized"
    end

    def test_raises_error_when_account_not_found
      result = execute_query(id: "999999")
      assert_nil result["data"]["account"]
      assert_not_empty result["errors"]
    end

    def test_raises_error_when_account_belongs_to_different_user
      other_user = users(:two)
      other_account = accounts(:monthly_budget)
      other_account.update!(user: other_user)

      result = execute_query(id: other_account.id.to_s)
      assert_nil result["data"]["account"]
      assert_not_empty result["errors"]
    end

    private

    def execute_query(id:, context: { current_user: @user })
      ServerSchema.execute(
        query,
        variables: { id: id },
        context: context
      )
    end

    def query
      <<~GRAPHQL
        query($id: ID!) {
          account(id: $id) {
            id
            name
            accountType
            startingBalanceCents
          }
        }
      GRAPHQL
    end
  end
end

