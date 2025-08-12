import { useQuery } from "@apollo/client";
import { GET_BUDGET_CATEGORY } from "../graphql/queries";
import { CreateTransactionForm } from "./CreateTransactionForm";

interface BudgetCategoryProps {
  categoryId: string;
  onBack: () => void;
}

interface Account {
  id: string;
  name: string;
  accountType: string;
}

interface Transaction {
  id: string;
  accountId: string;
  memo: string;
  amount: number;
  occurredOn: string;
  createdAt: string;
  updatedAt: string;
  account: Account;
}

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  description?: string;
  categoryType: string;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

export function BudgetCategory({ categoryId, onBack }: BudgetCategoryProps) {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET_CATEGORY, {
    variables: { id: categoryId },
  });

  if (loading) return <p>Loading category...</p>;
  if (error) {
    console.error("Error loading category:", error);
    return <p>Error loading category: {error.message}</p>;
  }

  const category: BudgetCategory = data.budgetCategory;

  const totalSpent = category.transactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0
  );
  const remaining = category.amount - totalSpent;
  const percentSpent =
    category.amount > 0 ? (totalSpent / category.amount) * 100 : 0;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...category.transactions].sort(
    (a, b) =>
      new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
  );

  return (
    <div className="budget-category-details">
      <div className="category-header">
        <button onClick={onBack} className="back-button">
          ← Back to Categories
        </button>
        <h1>
          {category.name}
          <span className={`category-type-badge ${category.categoryType}`}>
            {category.categoryType === "variable_expense" && "💸"}
            {category.categoryType === "debt_repayment" && "💳"}
            {category.categoryType.replace("_", " ").toUpperCase()}
          </span>
        </h1>
        {category.description && (
          <p className="description">{category.description}</p>
        )}
      </div>

      <div className="category-summary">
        <div className="summary-card">
          <h3>Budget Amount</h3>
          <p className="amount">${category.amount.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Spent</h3>
          <p className="amount spent">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p
            className={`amount ${remaining < 0 ? "over-budget" : "remaining"}`}
          >
            ${remaining.toFixed(2)}
          </p>
        </div>
        <div className="summary-card">
          <h3>Progress</h3>
          <p className="amount">{percentSpent.toFixed(1)}%</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar-large">
          <div
            className={`progress-fill ${
              percentSpent > 100 ? "over-budget" : ""
            }`}
            style={{
              width: `${Math.min(percentSpent, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="transactions-section">
        <h2>Transactions</h2>
        <CreateTransactionForm
          budgetCategoryId={categoryId}
          onTransactionCreated={refetch}
        />

        {sortedTransactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-main">
                    <h4>{transaction.memo}</h4>
                    <span className="account-info">
                      from {transaction.account.name}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-amount">
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <p className="transaction-date">
                      {new Date(transaction.occurredOn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
