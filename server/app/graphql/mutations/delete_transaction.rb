module Mutations
  class DeleteTransaction < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(id:)
      transaction = Transaction.find(id)
      user = context[:current_user] or raise GraphQL::ExecutionError, "Unauthorized"

      if transaction.account.user != user && (transaction.budget_category.nil? || transaction.budget_category.user != user)
        raise GraphQL::ExecutionError, "Unauthorized"
      end

      ApplicationRecord.transaction do
        if transaction.budget_category&.category_type == "debt_repayment"
          related_transaction = find_related_transaction(transaction)
          related_transaction&.destroy
        end

        if transaction.destroy
          {
            success: true,
            errors: []
          }
        else
          {
            success: false,
            errors: transaction.errors.full_messages
          }
        end
      end
    rescue ActiveRecord::RecordNotFound
      {
        success: false,
        errors: ["Transaction not found"]
      }
    end

    private

    def find_related_transaction(transaction)
      monthly_budget = Account.where(account_type: "monthly_budget", user: transaction.account.user).first
      
      if transaction.account == monthly_budget
        Transaction.joins(:account).where(
          accounts: { account_type: "loan", user: transaction.account.user },
          occurred_on: transaction.occurred_on,
          memo: transaction.memo,
          amount_cents: transaction.amount_cents.abs
        ).where(
          budget_category: [transaction.budget_category, nil]
        ).first
      else
        Transaction.where(
          account: monthly_budget,
          budget_category: transaction.budget_category,
          occurred_on: transaction.occurred_on,
          memo: transaction.memo,
          amount_cents: -transaction.amount_cents
        ).first
      end
    end
  end
end
