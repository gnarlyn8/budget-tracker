import { useQuery, useMutation } from "@apollo/client";
import { useState, useMemo } from "react";
import {
  GET_ACCOUNT,
  GET_ACCOUNTS,
  GET_BUDGET_CATEGORIES,
} from "../graphql/queries";
import { DELETE_TRANSACTION, DELETE_ACCOUNT } from "../graphql/mutations";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { EditAccountForm } from "./EditAccountForm";
import { Notification } from "./Notification";

interface AccountProps {
  accountId: string;
  onBack: () => void;
  onAllAccountsRefresh?: () => void;
}

interface BudgetCategory {
  id: string;
  name: string;
  categoryType: string;
}

interface Transaction {
  id: string;
  accountId: string;
  budgetCategoryId?: string;
  memo: string;
  amount: number;
  occurredOn: string;
  createdAt: string;
  updatedAt: string;
  budgetCategory?: BudgetCategory;
}

interface Account {
  id: string;
  name: string;
  accountType: string;
  startingBalance: number;
  currentBalance: number;
  totalSpendingOrPayments: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

export function Account({
  accountId,
  onBack,
  onAllAccountsRefresh,
}: AccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNT, {
    variables: { id: accountId },
  });

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction({
          variables: { id: transactionId },
          refetchQueries: [
            { query: GET_ACCOUNTS },
            { query: GET_ACCOUNT, variables: { id: accountId } },
            { query: GET_BUDGET_CATEGORIES },
          ],
        });
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

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the account "${account.name}"? This will also delete all associated transactions.`
      )
    ) {
      try {
        await deleteAccount({
          variables: { id: accountId },
          update: (cache) => {
            const existingAccounts = cache.readQuery({
              query: GET_ACCOUNTS,
            }) as { accounts: any[] } | null;
            if (existingAccounts) {
              cache.writeQuery({
                query: GET_ACCOUNTS,
                data: {
                  accounts: existingAccounts.accounts.filter(
                    (acc: any) => acc.id !== accountId
                  ),
                },
              });
            }

            cache.evict({
              id: cache.identify({ __typename: "Account", id: accountId }),
            });
            cache.gc();
          },
        });
        onBack();
      } catch (error) {
        console.error("Error deleting account:", error);
        setNotification({
          message: "Failed to delete account. Please try again.",
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

  const handleToggleEditForm = () => {
    const newState = !isEditing;
    setIsEditing(newState);

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
    if (!data?.account) return {};

    const sortedTransactions = [...data.account.transactions].sort(
      (a, b) =>
        new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
    );

    const groups: { [key: string]: Transaction[] } = {};

    sortedTransactions.forEach((transaction) => {
      const categoryName = transaction.budgetCategory?.name || "Uncategorized";
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(transaction);
    });

    return groups;
  }, [data?.account]);

  if (loading) return <p>Loading account...</p>;
  if (error) {
    console.error("Error loading account:", error);
    return <p>Error loading account: {error.message}</p>;
  }

  const account: Account = data.account;

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        >
          ← Back to Accounts
        </button>
        <div className="text-center">
          <h1>{account.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                $
              </span>
            </div>
            <h3 className="text-gray-800 dark:text-white text-lg font-semibold">
              Starting Balance
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${account.startingBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-teal-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-teal-400 text-lg font-bold">=</span>
            </div>
            <h3 className="text-white text-lg font-semibold">
              Current Balance
            </h3>
          </div>
          <p
            className={`text-2xl font-bold ${
              account.currentBalance < 0 ? "text-red-500" : "text-teal-500"
            }`}
          >
            ${account.currentBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-400 text-lg font-bold">
                {account.accountType === "loan" ? "P" : "S"}
              </span>
            </div>
            <h3 className="text-white text-lg font-semibold">
              {account.accountType === "loan"
                ? "Total Payments"
                : "Total Spending"}
            </h3>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            ${account.totalSpendingOrPayments.toFixed(2)}
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
              No transactions yet. Add your first transaction above!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(
              ([categoryName, transactions]) => (
                <div
                  key={categoryName}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-md"
                >
                  <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <h3 className="text-white text-lg font-semibold flex items-center">
                      <span className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center mr-3 text-xs font-bold text-blue-400">
                        {transactions.length}
                      </span>
                      {categoryName}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {transactions.length} transaction
                      {transactions.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="divide-y divide-gray-600">
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
                            {transaction.budgetCategory && (
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  transaction.budgetCategory.categoryType ===
                                  "variable_expense"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                }`}
                              >
                                {transaction.budgetCategory.categoryType.replace(
                                  "_",
                                  " "
                                )}
                              </span>
                            )}
                          </div>
                          <div className="text-right ml-4 flex items-center gap-2">
                            <div>
                              <span
                                className={`text-lg font-semibold ${
                                  transaction.amount < 0
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                              >
                                {transaction.amount < 0 ? "-" : "+"}$
                                {Math.abs(transaction.amount).toFixed(2)}
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

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleToggleEditForm}
          className="!bg-gray-600 hover:!bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          {isEditing ? "Cancel" : "Edit Account"}
        </button>
        <button
          onClick={handleDeleteAccount}
          className="!bg-red-500 hover:!bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Delete Account
        </button>
        <button
          onClick={handleToggleTransactionForm}
          className="!bg-teal-500 hover:!bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {showTransactionForm ? "Cancel" : "Add Transaction"}
        </button>
      </div>
      {isEditing && (
        <div className="mt-8">
          <EditAccountForm
            accountId={accountId}
            currentName={account.name}
            currentAccountType={account.accountType}
            currentStartingBalance={account.startingBalance}
            onAccountUpdated={() => {
              setIsEditing(false);
              refetch();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
      {showTransactionForm && (
        <div className="mt-8">
          <CreateTransactionForm
            accountId={accountId}
            onTransactionCreated={() => {
              refetch();
              setShowTransactionForm(false);
            }}
            onAllAccountsRefresh={onAllAccountsRefresh}
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
