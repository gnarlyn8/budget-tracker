import { useQuery } from "@apollo/client";
import { GET_BUDGET_CATEGORY } from "../graphql/queries";
import { CreateTransactionForm } from "./CreateTransactionForm";

interface BudgetCategoryProps {
  categoryId: string;
  onBack: () => void;
}

interface Transaction {
  id: string;
  budgetCategoryId: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetCategory {
  id: string;
  budgetId: string;
  name: string;
  amount: number;
  description?: string;
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
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const remaining = category.amount - totalSpent;

  return (
    <div className="budget-category">
      <div className="category-header">
        <button onClick={onBack} className="back-button">
          ← Back to Budget
        </button>
        <h1>{category.name}</h1>
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
      </div>

      <div className="transactions-section">
        <h2>Transactions</h2>
        <CreateTransactionForm
          budgetCategoryId={categoryId}
          onTransactionCreated={refetch}
        />

        {category.transactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            {category.transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <h4>{transaction.description}</h4>
                  <span className="transaction-amount">
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
                <p className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
