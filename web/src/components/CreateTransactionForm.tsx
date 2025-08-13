import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations";
import { GET_ACCOUNTS, GET_BUDGET_CATEGORIES } from "../graphql/queries";

interface CreateTransactionFormProps {
  accountId?: string;
  budgetCategoryId?: string;
  onTransactionCreated: () => void;
  onAllAccountsRefresh?: () => void;
}

export function CreateTransactionForm({
  accountId,
  budgetCategoryId,
  onTransactionCreated,
  onAllAccountsRefresh,
}: CreateTransactionFormProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(accountId || "");
  const [selectedBudgetCategoryId, setSelectedBudgetCategoryId] = useState(
    budgetCategoryId || ""
  );
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredOn, setOccurredOn] = useState("");

  const { data: accountsData } = useQuery(GET_ACCOUNTS);
  const { data: categoriesData } = useQuery(GET_BUDGET_CATEGORIES);

  const [createTransaction, { loading, error }] =
    useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTransaction({
        variables: {
          input: {
            accountId: selectedAccountId,
            budgetCategoryId: selectedBudgetCategoryId || null,
            memo,
            amount: parseFloat(amount),
            occurredOn: occurredOn || null,
          },
        },
      });

      setMemo("");
      setAmount("");
      setOccurredOn("");
      if (!accountId) setSelectedAccountId("");
      if (!budgetCategoryId) setSelectedBudgetCategoryId("");

      // Check if this was a debt repayment transaction
      const selectedCategory = categoriesData?.budgetCategories?.find(
        (cat: any) => cat.id === selectedBudgetCategoryId
      );

      if (
        selectedCategory?.categoryType === "debt_repayment" &&
        onAllAccountsRefresh
      ) {
        onAllAccountsRefresh();
      } else {
        onTransactionCreated();
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
    }
  };

  return (
    <div className="create-transaction-form">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        {!accountId && (
          <div className="form-group">
            <label htmlFor="account">Account:</label>
            <select
              id="account"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              required
            >
              <option value="">Select an account</option>
              {accountsData?.accounts?.map((account: any) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.accountType.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>
        )}

        {!budgetCategoryId && (
          <div className="form-group">
            <label htmlFor="budgetCategory">Budget Category (optional):</label>
            <select
              id="budgetCategory"
              value={selectedBudgetCategoryId}
              onChange={(e) => setSelectedBudgetCategoryId(e.target.value)}
            >
              <option value="">No category</option>
              {categoriesData?.budgetCategories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.categoryType.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBudgetCategoryId &&
          categoriesData?.budgetCategories?.find(
            (cat: any) => cat.id === selectedBudgetCategoryId
          )?.categoryType === "debt_repayment" && (
            <div className="form-group">
              <label htmlFor="account">Loan Account:</label>
              <select
                id="account"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                required
              >
                <option value="">Select loan account</option>
                {accountsData?.accounts
                  ?.filter((account: any) => account.accountType === "loan")
                  .map((account: any) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

        <div className="form-group">
          <label htmlFor="memo">Description:</label>
          <input
            type="text"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            required
            placeholder="e.g., Grocery shopping, Movie tickets"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="occurredOn">Date:</label>
          <input
            type="date"
            id="occurredOn"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            placeholder="Leave empty for today"
          />
        </div>

        <button type="submit" disabled={loading || !selectedAccountId}>
          {loading ? "Adding..." : "Add Transaction"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
