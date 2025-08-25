import { useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { CREATE_TRANSACTION } from "../../graphql/mutations";
import {
  GET_ACCOUNTS,
  GET_ACCOUNT,
  GET_BUDGET_CATEGORIES,
} from "../../graphql/queries";
import { Notification } from "../Notification";

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
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const client = useApolloClient();
  const { data: accountsData } = useQuery(GET_ACCOUNTS);
  const { data: categoriesData } = useQuery(GET_BUDGET_CATEGORIES);

  const monthlyBudgetAccount = accountsData?.accounts?.find(
    (account: any) => account.accountType === "monthly_budget"
  );
  const hasInsufficientFunds =
    monthlyBudgetAccount && monthlyBudgetAccount.currentBalance <= 0;

  const [createTransaction, { loading, error }] =
    useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createTransaction({
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

      await client.refetchQueries({
        include: [GET_ACCOUNTS, ...(accountId ? [GET_ACCOUNT] : [])],
      });

      if (result.data?.createTransaction?.errors?.length > 0) {
        console.error(
          "Transaction creation errors:",
          result.data.createTransaction.errors
        );
        setNotification({
          message: `Failed to create transaction: ${result.data.createTransaction.errors.join(
            ", "
          )}`,
          type: "error",
        });
        return;
      }

      setMemo("");
      setAmount("");
      setOccurredOn("");
      if (!accountId) setSelectedAccountId("");
      if (!budgetCategoryId) setSelectedBudgetCategoryId("");

      setNotification({
        message: "Transaction created successfully!",
        type: "success",
      });
      onTransactionCreated?.();
      onAllAccountsRefresh?.();
    } catch (err) {
      console.error("Error creating transaction:", err);
      setNotification({
        message: "Failed to create transaction. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-md">
      <h3 className="text-gray-100 text-xl font-semibold mb-6 text-center">
        Add New Transaction
      </h3>

      {hasInsufficientFunds && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6 text-center">
          ⚠️ Cannot add transactions: Monthly budget balance is $
          {monthlyBudgetAccount?.currentBalance.toFixed(2)}
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit}>
        {!accountId && !selectedBudgetCategoryId && (
          <div className="mb-6">
            <label
              htmlFor="account"
              className="block mb-2 text-gray-300 font-medium"
            >
              Account:
            </label>
            <select
              id="account"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
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
          <div className="mb-6">
            <label
              htmlFor="budgetCategory"
              className="block mb-2 text-gray-300 font-medium"
            >
              Budget Category (optional):
            </label>
            <select
              id="budgetCategory"
              value={selectedBudgetCategoryId}
              onChange={(e) => setSelectedBudgetCategoryId(e.target.value)}
              className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            >
              <option value="">No category</option>
              {categoriesData?.budgetCategories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name} (${category.amount})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBudgetCategoryId && (
          <>
            {categoriesData?.budgetCategories?.find(
              (cat: any) => cat.id === selectedBudgetCategoryId
            )?.categoryType === "debt_repayment" ? (
              <div className="mb-6">
                <label
                  htmlFor="account"
                  className="block mb-2 text-gray-300 font-medium"
                >
                  Loan Account:
                </label>
                <select
                  id="account"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer appearance-none bg-no-repeat bg-right-3 bg-center bg-4 pr-10 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  }}
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
            ) : (
              <div className="mb-6">
                <p className="bg-purple-900/20 border border-purple-500 text-purple-400 p-4 rounded-lg text-center">
                  💡 This transaction will be deducted from your monthly budget
                  account
                </p>
              </div>
            )}
          </>
        )}

        <div className="mb-6">
          <label
            htmlFor="memo"
            className="block mb-2 text-gray-300 font-medium"
          >
            Description:
          </label>
          <input
            type="text"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            required
            disabled={hasInsufficientFunds}
            placeholder="e.g., Grocery shopping, Movie tickets"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block mb-2 text-gray-300 font-medium"
          >
            Amount ($):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            disabled={hasInsufficientFunds}
            placeholder="0.00"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="occurredOn"
            className="block mb-2 text-gray-300 font-medium"
          >
            Date:
          </label>
          <input
            type="date"
            id="occurredOn"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            disabled={hasInsufficientFunds}
            placeholder="Leave empty for today"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedAccountId || hasInsufficientFunds}
          className="w-full p-4 bg-purple-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading
            ? "Adding..."
            : hasInsufficientFunds
            ? "Insufficient Funds"
            : "Add Transaction"}
        </button>

        {error && (
          <p className="text-red-400 mt-4 text-center">
            Error: {error.message}
          </p>
        )}
      </form>
    </div>
  );
}
