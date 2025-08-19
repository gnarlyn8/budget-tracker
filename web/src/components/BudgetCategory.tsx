import { useQuery, useMutation } from "@apollo/client";
import { useState, useMemo } from "react";
import { GET_BUDGET_CATEGORY } from "../graphql/queries";
import { DELETE_TRANSACTION } from "../graphql/mutations";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { Notification } from "./Notification";

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
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_BUDGET_CATEGORY, {
    variables: { id: categoryId },
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction({
          variables: { id: transactionId },
        });
        refetch();
        setNotification({
          message: "Transaction deleted successfully!",
          type: "success",
        });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        setNotification({
          message: "Failed to delete transaction. Please try again.",
          type: "error",
        });
      }
    }
  };

  const handleToggleTransactionForm = () => {
    const newState = !showTransactionForm;
    setShowTransactionForm(newState);

    if (newState) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const groupedTransactions = useMemo(() => {
    if (!data?.budgetCategory) return {};

    const sortedTransactions = [...data.budgetCategory.transactions].sort(
      (a, b) =>
        new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
    );

    const groups: { [key: string]: Transaction[] } = {};

    sortedTransactions.forEach((transaction) => {
      const accountName = transaction.account.name;
      if (!groups[accountName]) {
        groups[accountName] = [];
      }
      groups[accountName].push(transaction);
    });

    return groups;
  }, [data?.budgetCategory]);

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

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        >
          ← Back to Categories
        </button>
        <div className="text-center">
          <h1 className="text-gray-800 dark:text-white text-3xl font-bold">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                $
              </span>
            </div>
            <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
              Budget Amount
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${category.amount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-red-600 dark:text-red-400 text-lg font-bold">
                ↓
              </span>
            </div>
            <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
              Total Spent
            </h3>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-teal-600 dark:text-teal-400 text-lg font-bold">
                =
              </span>
            </div>
            <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
              Remaining
            </h3>
          </div>
          <p
            className={`text-2xl font-bold ${
              remaining < 0 ? "text-red-500" : "text-teal-500"
            }`}
          >
            ${remaining.toFixed(2)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 dark:text-purple-400 text-lg font-bold">
                %
              </span>
            </div>
            <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
              Progress
            </h3>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {percentSpent.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-800 dark:text-white text-2xl font-bold">
            Transactions
          </h2>
        </div>
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 font-bold">
              +
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No transactions yet. Add your first transaction below!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(
              ([accountName, transactions]) => (
                <div
                  key={accountName}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md"
                >
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-gray-800 dark:text-white text-lg font-semibold flex items-center">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-blue-600 dark:text-blue-400">
                        {transactions.length}
                      </span>
                      {accountName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {transactions.length} transaction
                      {transactions.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-150"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-gray-800 dark:text-white font-medium mb-1">
                              {transaction.memo}
                            </h4>
                          </div>
                          <div className="text-right ml-4 flex items-center gap-2">
                            <div>
                              <span className="text-lg font-semibold text-red-500">
                                -${Math.abs(transaction.amount).toFixed(2)}
                              </span>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                {new Date(
                                  transaction.occurredOn
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteTransaction(transaction.id)
                              }
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-150"
                              title="Delete transaction"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleToggleTransactionForm}
          className="!bg-teal-500 hover:!bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {showTransactionForm ? "Cancel" : "Add Transaction"}
        </button>
      </div>

      {showTransactionForm && (
        <div className="mt-8">
          <CreateTransactionForm
            budgetCategoryId={categoryId}
            onTransactionCreated={() => {
              refetch();
              setShowTransactionForm(false);
            }}
          />
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
