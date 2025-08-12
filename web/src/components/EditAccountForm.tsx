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
    <div className="edit-account-form">
      <h3>Edit Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-name">Account Name:</label>
          <input
            type="text"
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Monthly Budget, Credit Card"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-accountType">Account Type:</label>
          <select
            id="edit-accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="monthly_budget">Monthly Budget</option>
            <option value="loan">Loan/Credit</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit-startingBalance">Starting Balance ($):</label>
          <input
            type="number"
            id="edit-startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            step="0.01"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Account"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
