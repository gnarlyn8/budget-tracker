class Ledger
  def self.spend(cash:, category:, amount_cents:, on:, memo:)
    Transaction.create!(
      account_id: cash.id,
      budget_category_id: category.id,
      amount_cents: -amount_cents,
      occurred_on: on,
      memo: memo
    )
  end

  def self.repay(cash:, loan:, category:, amount_cents:, on:, memo:)
    ApplicationRecord.transaction do
      Transaction.create!(
        account_id: cash.id,
        budget_category_id: category.id,
        amount_cents: -amount_cents,
        occurred_on: on,
        memo: memo
      )

      Transaction.create!(
        account_id: loan.id,
        amount_cents: -amount_cents,
        occurred_on: on,
        memo: memo
      )
    end
  end
end