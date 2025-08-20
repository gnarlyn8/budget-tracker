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

      monthly_budget_account = monthly_budget
      current_balance_cents = monthly_budget_account.starting_balance_cents + monthly_budget_account.transactions.sum(:amount_cents)
      
      if current_balance_cents <= 0
        return {
          transaction: nil,
          errors: ["Insufficient funds in monthly budget. Current balance: $#{current_balance_cents / 100.0}"]
        }
      end

      transaction =
        case category&.category_type
        when "debt_repayment"
          Ledger.repay(cash: monthly_budget, loan: account, category: category, amount_cents: cents, on: on, memo: memo)
        when "variable_expense"
          Ledger.spend(cash: monthly_budget, category: category, amount_cents: cents, on: on, memo: memo)
        else
          Transaction.create!(
            account: monthly_budget,
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

    private

    def monthly_budget
      user = context[:current_user]
      @monthly_budget ||= Account.where(account_type: "monthly_budget", user: user).first
      raise ArgumentError, "No monthly budget account found" unless @monthly_budget

      @monthly_budget
    end
  end
end
