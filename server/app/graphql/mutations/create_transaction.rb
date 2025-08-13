module Mutations
  class CreateTransaction < BaseMutation
    description "Create a spend or debt repayment transaction via the Ledger service"

    argument :account_id, ID, required: true
    argument :budget_category_id, ID, required: false
    argument :loan_account_id, ID, required: false
    argument :memo, String, required: true
    argument :amount, Float, required: true
    argument :occurred_on, GraphQL::Types::ISO8601Date, required: false

    field :transaction, Types::TransactionType, null: true
    field :errors, [String], null: false

    def resolve(**args)
      account  = Account.find(args[:account_id])
      category = args[:budget_category_id] ? BudgetCategory.find(args[:budget_category_id]) : nil
      cents    = (args[:amount] * 100).round
      on       = args[:occurred_on] || Date.current
      memo     = args[:memo]

      transaction =
        case category&.category_type
        when "debt_repayment"
          loan = require_loan!(args[:loan_account_id])
          Ledger.repay(cash: account, loan: loan, category: category, amount_cents: cents, on: on, memo: memo)
        when "variable_expense"
          Ledger.spend(cash: account, category: category, amount_cents: cents, on: on, memo: memo)
        else
          Transaction.create!(
            account: account,
            budget_category: category,
            amount_cents: cents,
            occurred_on: on,
            memo: memo
          )
        end

      { transaction: transaction, errors: [] }
    rescue ActiveRecord::RecordInvalid => e
      { transaction: nil, errors: e.record.errors.full_messages }
    rescue ActiveRecord::RecordNotFound, ArgumentError => e
      { transaction: nil, errors: [e.message] }
    end

    private

    def require_loan!(loan_id)
      raise ArgumentError, "Loan account must be specified for debt repayment transactions" unless loan_id

      loan_account = Account.find(loan_id)
      raise ArgumentError, "Specified account is not a loan account" unless loan_account.type_loan?

      loan_account
    end
  end
end
