import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { CREATE_ACCOUNT } from "../graphql/mutations";
import { GET_ACCOUNTS } from "../graphql/queries";
import { Notification } from "./Notification";

export function CreateAccountForm() {
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState("monthly_budget");
  const [startingBalance, setStartingBalance] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const client = useApolloClient();

  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createAccount({
        variables: {
          name,
          accountType,
          startingBalance: startingBalance ? parseFloat(startingBalance) : 0,
        },
      });

      const existingData = client.readQuery({ query: GET_ACCOUNTS });
      if (existingData) {
        client.writeQuery({
          query: GET_ACCOUNTS,
          data: {
            accounts: [
              ...existingData.accounts,
              result.data.createAccount.account,
            ],
          },
        });
      }

      setName("");
      setAccountType("monthly_budget");
      setStartingBalance("");
      setNotification({
        message: "Account created successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error creating account:", err);
      setNotification({
        message: "Failed to create account. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="create-account-form">
      <h2>Create New Account</h2>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Account Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Monthly Budget, Credit Card"
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountType">Account Type:</label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="monthly_budget">Monthly Budget</option>
            <option value="loan">Loan/Credit</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startingBalance">Starting Balance ($):</label>
          <input
            type="number"
            id="startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
