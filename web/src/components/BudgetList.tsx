import { useQuery } from "@apollo/client";
import { GET_BUDGETS } from "../graphql/queries";

interface Transaction {
  id: string;
  amount: number;
}

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  description?: string;
  transactions: Transaction[];
}

interface Budget {
  id: string;
  name: string;
  description?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  budgetCategories: BudgetCategory[];
}

interface BudgetListProps {
  onBudgetClick: (budgetId: string) => void;
}

export function BudgetList({ onBudgetClick }: BudgetListProps) {
  const { loading, error, data } = useQuery(GET_BUDGETS);

  if (loading) return <p>Loading budgets...</p>;
  if (error) {
    console.error("Error loading budgets:", error);
    return <p>Error loading budgets: {error.message}</p>;
  }

  const budgets = data?.budgets || [];

  return (
    <div className="budget-list">
      <h2>Your Budgets</h2>
      {budgets.length === 0 ? (
        <p>No budgets found. Create your first budget!</p>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget: Budget) => {
            const totalSpent = budget.budgetCategories.reduce(
              (budgetTotal, category) => {
                const categorySpent = category.transactions.reduce(
                  (sum, transaction) => sum + transaction.amount,
                  0
                );
                return budgetTotal + categorySpent;
              },
              0
            );
            const remaining = budget.totalAmount - totalSpent;

            return (
              <div
                key={budget.id}
                className="budget-card"
                onClick={() => onBudgetClick(budget.id)}
                style={{ cursor: "pointer" }}
              >
                <h3>{budget.name}</h3>
                <div className="budget-amounts">
                  <p className="total-amount">
                    Total Budget: ${budget.totalAmount.toFixed(2)}
                  </p>
                  <p className="spent-amount">
                    Total Spent: ${totalSpent.toFixed(2)}
                  </p>
                  <p
                    className={`remaining-amount ${
                      remaining < 0 ? "over-budget" : "remaining"
                    }`}
                  >
                    Remaining: ${remaining.toFixed(2)}
                  </p>
                </div>
                {budget.description && (
                  <p className="description">{budget.description}</p>
                )}
                <p className="categories-count">
                  {budget.budgetCategories.length} categories
                </p>
                <p className="date">
                  Created: {new Date(budget.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
