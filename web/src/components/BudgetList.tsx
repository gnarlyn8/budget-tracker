import { useQuery } from "@apollo/client";
import { GET_BUDGETS } from "../graphql/queries";

interface Budget {
  id: string;
  name: string;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export function BudgetList() {
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
          {budgets.map((budget: Budget) => (
            <div key={budget.id} className="budget-card">
              <h3>{budget.name}</h3>
              <p className="amount">${budget.amount.toFixed(2)}</p>
              {budget.description && (
                <p className="description">{budget.description}</p>
              )}
              <p className="date">
                Created: {new Date(budget.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
