import { useQuery } from "@apollo/client";
import { GET_BUDGET_CATEGORIES } from "../graphql/queries";

interface Transaction {
  id: string;
  amount: number;
  memo: string;
  occurredOn: string;
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

interface BudgetCategoryListProps {
  onCategoryClick: (categoryId: string) => void;
}

export function BudgetCategoryList({
  onCategoryClick,
}: BudgetCategoryListProps) {
  const { loading, error, data } = useQuery(GET_BUDGET_CATEGORIES);

  if (loading) return <p>Loading budget categories...</p>;
  if (error) {
    console.error("Error loading budget categories:", error);
    return <p>Error loading budget categories: {error.message}</p>;
  }

  const budgetCategories = data?.budgetCategories || [];

  return (
    <div className="budget-category-list">
      <h2>Your Budget Categories</h2>
      {budgetCategories.length === 0 ? (
        <p>No budget categories found. Create your first category!</p>
      ) : (
        <div className="category-grid">
          {budgetCategories.map((category: BudgetCategory) => {
            const totalSpent = category.transactions.reduce(
              (sum, transaction) => sum + Math.abs(transaction.amount),
              0
            );
            const remaining = category.amount - totalSpent;
            const percentSpent =
              category.amount > 0 ? (totalSpent / category.amount) * 100 : 0;

            return (
              <div
                key={category.id}
                className="category-card"
                onClick={() => onCategoryClick(category.id)}
                style={{ cursor: "pointer" }}
              >
                <h3>
                  {category.name}
                  <span
                    className={`category-type-badge ${category.categoryType}`}
                  >
                    {category.categoryType === "variable_expense" && "💸"}
                    {category.categoryType === "debt_repayment" && "💳"}
                    {category.categoryType.replace("_", " ").toUpperCase()}
                  </span>
                </h3>

                <div className="category-amounts">
                  <p className="budget-amount">
                    Budget: ${category.amount.toFixed(2)}
                  </p>
                  <p className="spent-amount">
                    Spent: ${totalSpent.toFixed(2)}
                  </p>
                  <p
                    className={`remaining-amount ${
                      remaining < 0 ? "over-budget" : "remaining"
                    }`}
                  >
                    Remaining: ${remaining.toFixed(2)}
                  </p>
                </div>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      percentSpent > 100 ? "over-budget" : ""
                    }`}
                    style={{
                      width: `${Math.min(percentSpent, 100)}%`,
                    }}
                  />
                </div>
                <p className="progress-text">
                  {percentSpent.toFixed(1)}% of budget used
                </p>

                {category.description && (
                  <p className="description">{category.description}</p>
                )}

                <div className="category-stats">
                  <p className="transaction-count">
                    {category.transactions.length} transactions
                  </p>
                  <p className="date">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
