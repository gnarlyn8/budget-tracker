import { useQuery } from "@apollo/client";
import { GET_ACCOUNT } from "../graphql/queries";
import { CreateTransactionForm } from "./CreateTransactionForm";

interface AccountProps {
  accountId: string;
  onBack: () => void;
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
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

export function Account({ accountId, onBack }: AccountProps) {
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNT, {
    variables: { id: accountId },
  });

  if (loading) return <p>Loading account...</p>;
  if (error) {
    console.error("Error loading account:", error);
    return <p>Error loading account: {error.message}</p>;
  }

  const account: Account = data.account;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...account.transactions].sort(
    (a, b) =>
      new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
  );

  // Calculate total inflows and outflows
  const totalInflows = account.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflows = account.transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="account-details">
      <div className="account-header">
        <button onClick={onBack} className="back-button">
          ← Back to Accounts
        </button>
        <h1>
          {account.name}
          <span className={`account-type-badge ${account.accountType}`}>
            {account.accountType === "monthly_budget" && "💰"}
            {account.accountType === "loan" && "🏦"}
            {account.accountType.replace("_", " ").toUpperCase()}
          </span>
        </h1>
      </div>

      <div className="account-summary">
        <div className="summary-card">
          <h3>Starting Balance</h3>
          <p className="amount">${account.startingBalance.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Current Balance</h3>
          <p
            className={`amount ${
              account.currentBalance < 0 ? "negative" : "positive"
            }`}
          >
            ${account.currentBalance.toFixed(2)}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Inflows</h3>
          <p className="amount positive">${totalInflows.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Outflows</h3>
          <p className="amount negative">${totalOutflows.toFixed(2)}</p>
        </div>
      </div>

      <div className="transactions-section">
        <h2>Transactions</h2>
        <CreateTransactionForm
          accountId={accountId}
          onTransactionCreated={refetch}
        />

        {sortedTransactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="transactions-list">
            {sortedTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <div className="transaction-main">
                    <h4>{transaction.memo}</h4>
                    {transaction.budgetCategory && (
                      <span
                        className={`category-badge ${transaction.budgetCategory.categoryType}`}
                      >
                        {transaction.budgetCategory.categoryType ===
                          "variable_expense" && "💸"}
                        {transaction.budgetCategory.categoryType ===
                          "debt_repayment" && "💳"}
                        {transaction.budgetCategory.name}
                      </span>
                    )}
                  </div>
                  <div className="transaction-details">
                    <span
                      className={`transaction-amount ${
                        transaction.amount < 0 ? "negative" : "positive"
                      }`}
                    >
                      {transaction.amount < 0 ? "-" : "+"}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <p className="transaction-date">
                      {new Date(transaction.occurredOn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
