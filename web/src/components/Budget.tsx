import { useQuery } from "@apollo/client";
import { GET_BUDGET } from "../graphql/queries";
import { CreateBudgetCategoryForm } from "./CreateBudgetCategoryForm";

interface BudgetProps {
  budgetId: string;
  onBack: () => void;
  onCategoryClick: (categoryId: string) => void;
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

export function Budget({ budgetId, onBack, onCategoryClick }: BudgetProps) {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET, {
    variables: { id: budgetId },
  });

  if (loading) return <p>Loading budget...</p>;
  if (error) {
    console.error("Error loading budget:", error);
    return <p>Error loading budget: {error.message}</p>;
  }

  const budget: Budget = data.budget;

  const totalSpent = budget.budgetCategories.reduce((budgetTotal, category) => {
    const categorySpent = category.transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    return budgetTotal + categorySpent;
  }, 0);
  const remaining = budget.totalAmount - totalSpent;

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
          <h3>Total Budget</h3>
          <p className="amount">${budget.totalAmount.toFixed(2)}</p>
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

      <div className="categories-section">
        <h2>Budget Categories</h2>
        {budget.budgetCategories.length === 0 ? (
          <p>No categories yet. Add your first category below!</p>
        ) : (
          <div className="categories-list">
            {budget.budgetCategories.map((category) => {
              const categorySpent = category.transactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
              );
              const categoryRemaining = category.amount - categorySpent;

              return (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <h3>{category.name}</h3>
                    <div className="category-amounts">
                      <span className="category-budget">
                        Budget: ${category.amount.toFixed(2)}
                      </span>
                      <span className="category-spent">
                        Spent: ${categorySpent.toFixed(2)}
                      </span>
                      <span
                        className={`category-remaining ${
                          categoryRemaining < 0 ? "over-budget" : "remaining"
                        }`}
                      >
                        Remaining: ${categoryRemaining.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {category.description && (
                    <p className="category-description">
                      {category.description}
                    </p>
                  )}
                  <div className="transactions-list">
                    {category.transactions.length === 0 ? (
                      <p>No transactions yet.</p>
                    ) : (
                      category.transactions.map((transaction) => (
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
                      ))
                    )}
                  </div>
                  <button
                    className="view-category-button"
                    onClick={() => onCategoryClick(category.id)}
                  >
                    View Category Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <CreateBudgetCategoryForm
          budgetId={budgetId}
          onBudgetCategoryCreated={refetch}
        />
      </div>
    </div>
  );
}
