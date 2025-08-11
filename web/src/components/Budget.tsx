import { useQuery } from "@apollo/client";
import { GET_BUDGET } from "../graphql/queries";
import { CreateTransactionForm } from "./CreateTransactionForm";

interface BudgetProps {
  budgetId: string;
  onBack: () => void;
}

interface Transaction {
  id: string;
  budgetId: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

export function Budget({ budgetId, onBack }: BudgetProps) {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET, {
    variables: { id: budgetId },
  });

  if (loading) return <p>Loading budget...</p>;
  if (error) {
    console.error("Error loading budget:", error);
    return <p>Error loading budget: {error.message}</p>;
  }

  const budget: Budget = data.budget;

  const totalSpent = budget.transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
  const remaining = budget.amount - totalSpent;

  return (
    <div className="budget-show">
      <div className="budget-header">
        <button onClick={onBack} className="back-button">
          ← Back to Budgets
        </button>
        <h1>{budget.name}</h1>
        {budget.description && (
          <p className="description">{budget.description}</p>
        )}
      </div>

      <div className="budget-summary">
        <div className="summary-card">
          <h3>Budget Amount</h3>
          <p className="amount">${budget.amount.toFixed(2)}</p>
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
        {budget.transactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            {budget.transactions.map((transaction) => (
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
        <CreateTransactionForm
          budgetId={budgetId}
          onTransactionCreated={refetch}
        />
      </div>
    </div>
  );
}
