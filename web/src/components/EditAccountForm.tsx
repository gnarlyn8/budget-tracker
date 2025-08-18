import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ACCOUNT } from "../graphql/mutations";

interface EditAccountFormProps {
  accountId: string;
  currentName: string;
  currentAccountType: string;
  currentStartingBalance: number;
  onAccountUpdated: () => void;
  onCancel: () => void;
}

export function EditAccountForm({
  accountId,
  currentName,
  currentAccountType,
  currentStartingBalance,
  onAccountUpdated,
  onCancel,
}: EditAccountFormProps) {
  const [name, setName] = useState(currentName);
  const [accountType, setAccountType] = useState(currentAccountType);
  const [startingBalance, setStartingBalance] = useState(
    currentStartingBalance.toString()
  );

  const [updateAccount, { loading, error }] = useMutation(UPDATE_ACCOUNT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAccount({
        variables: {
          id: accountId,
          name,
          accountType,
          startingBalance: parseFloat(startingBalance),
        },
      });

      onAccountUpdated();
    } catch (err) {
      console.error("Error updating account:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md">
      <h3 className="text-gray-800 dark:text-white text-xl font-bold mb-6">
        Edit Account
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="edit-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Account Name
          </label>
          <input
            type="text"
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Monthly Budget, Credit Card"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="edit-accountType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Account Type
          </label>
          <select
            id="edit-accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="monthly_budget">Monthly Budget</option>
            <option value="loan">Loan/Credit</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-startingBalance"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Starting Balance ($)
          </label>
          <input
            type="number"
            id="edit-startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {loading ? "Updating..." : "Update Account"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">
              Error: {error.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
