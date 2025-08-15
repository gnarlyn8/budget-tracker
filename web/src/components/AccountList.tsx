import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "../graphql/queries";

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

  if (loading) return <p>Loading accounts...</p>;
  if (error) {
    console.error("Error loading accounts:", error);
    return <p>Error loading accounts: {error.message}</p>;
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
        className={isMonthlyBudget ? "monthly-budget-card" : "account-card"}
        onClick={() => onAccountClick(account.id)}
        style={{ cursor: "pointer" }}
      >
        <h3>
          {account.name}
          <span className={`account-type-badge ${account.accountType}`}>
            {account.accountType === "monthly_budget" && "💰"}
            {account.accountType === "loan" && "🏦"}
            {account.accountType.replace("_", " ").toUpperCase()}
          </span>
        </h3>

        <div className="account-balances">
          <p className="starting-balance">
            Starting: ${account.startingBalance.toFixed(2)}
          </p>
          <p
            className={`current-balance ${
              account.currentBalance < 0 ? "negative" : "positive"
            }`}
          >
            Current: ${account.currentBalance.toFixed(2)}
          </p>
        </div>

        <div className="recent-transactions">
          <h4>Recent Transactions</h4>
          {recentTransactions.length === 0 ? (
            <p className="no-transactions">No transactions yet</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-preview">
                <span className="transaction-memo">{transaction.memo}</span>
                <span
                  className={`transaction-amount ${
                    transaction.amount < 0 ? "negative" : "positive"
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        <p className="transaction-count">
          {account.transactions.length} total transactions
        </p>
        <p className="date">
          Created: {new Date(account.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <div className="account-list">
      <h2>Your Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found. Create your first account!</p>
      ) : (
        <div className="account-grid">
          {monthlyBudgetAccounts.length > 0 && (
            <div className="account-row monthly-budget-row">
              {monthlyBudgetAccounts.map((account: Account) =>
                renderAccountCard(account, true)
              )}
            </div>
          )}

          {loanRows.map((row, rowIndex) => (
            <div key={rowIndex} className="account-row loan-row">
              {row.map((account: Account) => renderAccountCard(account, false))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
