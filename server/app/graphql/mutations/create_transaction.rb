module Mutations
  class CreateTransaction < BaseMutation
    description "Create a spend or debt repayment transaction via the Ledger service"

    argument :account_id, ID, required: true
    argument :budget_category_id, ID, required: false
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
          monthly_budget = Account.where(account_type: "monthly_budget").first
          raise ArgumentError, "No monthly budget account found" unless monthly_budget

          Ledger.repay(cash: monthly_budget, loan: account, category: category, amount_cents: cents, on: on, memo: memo)
        when "variable_expense"
          Ledger.spend(cash: account, category: category, amount_cents: cents, on: on, memo: memo)
        else

          Transaction.create!(
            account: account,
            budget_category: category,
            amount_cents: -cents,
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
  end
end
