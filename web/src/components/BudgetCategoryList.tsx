import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_BUDGET_CATEGORIES } from "../graphql/queries";
import { DELETE_BUDGET_CATEGORY } from "../graphql/mutations";
import { Notification } from "./Notification";

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

export function BudgetCategoryList() {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET_CATEGORIES);
  const [deleteBudgetCategory] = useMutation(DELETE_BUDGET_CATEGORY);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleDeleteBudgetCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the budget category "${categoryName}"?`
      )
    ) {
      try {
        await deleteBudgetCategory({
          variables: { id: categoryId },
        });
        refetch();
        setNotification({
          message: `Budget category "${categoryName}" deleted successfully`,
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting budget category:", error);
        setNotification({
          message: "Failed to delete budget category",
          type: "error",
        });
      }
    }
  };

  if (loading) return <p>Loading budget categories...</p>;
  if (error) {
    console.error("Error loading budget categories:", error);
    return <p>Error loading budget categories: {error.message}</p>;
  }

  const budgetCategories = data?.budgetCategories || [];

  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {budgetCategories.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No budget categories found. Create your first category below!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <h3>{category.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBudgetCategory(category.id, category.name);
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-150 text-xs"
                    title="Delete budget category"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-gray-800 dark:text-white font-medium">
                    Budget: ${category.amount.toFixed(2)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Spent: ${totalSpent.toFixed(2)}
                  </p>
                  <p
                    className={`font-semibold ${
                      remaining < 0 ? "text-red-500" : "text-teal-500"
                    }`}
                  >
                    Remaining: ${remaining.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentSpent > 100 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(percentSpent, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                    {percentSpent.toFixed(1)}% of budget used
                  </p>
                </div>

                {category.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 italic">
                    {category.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {category.transactions.length} transactions
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
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
