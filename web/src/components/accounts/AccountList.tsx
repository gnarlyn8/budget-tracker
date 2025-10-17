import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "../../graphql/queries";

interface Transaction {
  id: string;
  amount: number;
  memo: string;
  occurredOn: string;
  budgetCategory?: {
    id: string;
    name: string;
    categoryType: string;
  };
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

interface AccountListProps {
  onAccountClick: (accountId: string) => void;
}

export function AccountList({ onAccountClick }: AccountListProps) {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading)
    return (
      <p className="text-center text-gray-400 text-lg">Loading accounts...</p>
    );
  if (error) {
    console.error("Error loading accounts:", error);
    return <p className="text-center text-red-500 text-lg">{error.message}</p>;
  }

  const accounts = data?.accounts || [];

  const monthlyBudgetAccounts = accounts.filter(
    (account: Account) => account.accountType === "monthly_budget"
  );
  const loanAccounts = accounts.filter(
    (account: Account) => account.accountType === "loan"
  );

  const loanRows = [];
  for (let i = 0; i < loanAccounts.length; i += 3) {
    loanRows.push(loanAccounts.slice(i, i + 3));
  }

  const columnsClass =
    loanAccounts.length === 1
      ? "grid-cols-1"
      : loanAccounts.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  const renderAccountCard = (account: Account, isMonthlyBudget = false) => {
    const recentTransactions = account.transactions
      .slice(0, 3)
      .sort(
        (a, b) =>
          new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
      );
    return (
      <div
        key={account.id}
        className={`bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-lg cursor-pointer relative ${
          isMonthlyBudget ? "w-full" : ""
        }`}
        onClick={() => onAccountClick(account.id)}
      >
        <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-purple-500 text-white font-normal">
          {account.accountType === "monthly_budget"}
          {account.accountType === "loan"}
          {account.accountType.replace("_", " ").toUpperCase()}
        </span>
        <h3 className="text-white text-xl font-semibold mb-2 pr-16">
          {account.name}
        </h3>

        <div className="my-4">
          <p className="text-sm text-gray-400 mb-1">
            Starting: ${account.startingBalance.toFixed(2)}
          </p>
          <p
            className={`font-bold text-lg ${
              account.currentBalance < 0 ? "text-red-500" : "text-teal-500"
            }`}
          >
            Current: ${account.currentBalance.toFixed(2)}
          </p>
        </div>

        <div className="my-4">
          <h4 className="text-gray-800 dark:text-white text-base font-medium mb-2">
            Recent Transactions
          </h4>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-sm">
              No transactions yet
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center py-1 text-sm"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {transaction.memo}
                </span>
                <span
                  className={`${
                    transaction.amount < 0 ? "text-red-500" : "text-teal-500"
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
          {account.transactions.length} total transactions
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          Created: {new Date(account.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      {accounts.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          No accounts found. Create your first account!
        </p>
      ) : (
        <div className="space-y-8">
          {monthlyBudgetAccounts.length > 0 && (
            <div className="w-full">
              {monthlyBudgetAccounts.map((account: Account) =>
                renderAccountCard(account, true)
              )}
            </div>
          )}

          {loanAccounts.length > 0 && (
            <div className="flex justify-center">
              <div className={`grid gap-6 w-full ${columnsClass}`}>
                {loanAccounts.map((account: Account) =>
                  renderAccountCard(account, false)
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
