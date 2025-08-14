import { useState } from "react";
import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import { CREATE_ACCOUNT } from "../graphql/mutations";
import { GET_ACCOUNTS } from "../graphql/queries";

export function CreateBankAccountForm() {
  const { data: accountsData } = useQuery(GET_ACCOUNTS);
  const hasMonthlyBudget = accountsData?.accounts?.some(
    (account: any) => account.accountType === "monthly_budget"
  );
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState(
    hasMonthlyBudget ? "loan" : "monthly_budget"
  );
  const [startingBalance, setStartingBalance] = useState("");
  const client = useApolloClient();

  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createAccount({
        variables: {
          name,
          accountType,
          startingBalance: parseFloat(startingBalance),
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
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="create-account-form">
      <h2>Create New Bank Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Account Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Checking Account, Savings Account"
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
            <option value="monthly_budget" disabled={hasMonthlyBudget}>
              Monthly Budget {hasMonthlyBudget ? "(Already exists)" : ""}
            </option>
            <option value="loan">Loan</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startingBalance">Starting Balance:</label>
          <input
            type="number"
            id="startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            required
            placeholder="e.g., 1000"
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
