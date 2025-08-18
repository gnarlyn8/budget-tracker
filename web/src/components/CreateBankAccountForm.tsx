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
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-md">
      <h2 className="text-gray-100 text-xl font-semibold mb-6 text-center">
        Create New Bank Account
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-gray-300 font-medium"
          >
            Account Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Checking Account, Savings Account"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="accountType"
            className="block mb-2 text-gray-300 font-medium"
          >
            Account Type:
          </label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer appearance-none bg-no-repeat bg-right-3 bg-center bg-4 pr-10 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
            }}
          >
            <option value="monthly_budget" disabled={hasMonthlyBudget}>
              Monthly Budget {hasMonthlyBudget ? "(Already exists)" : ""}
            </option>
            <option value="loan">Loan</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="startingBalance"
            className="block mb-2 text-gray-300 font-medium"
          >
            Starting Balance:
          </label>
          <input
            type="number"
            id="startingBalance"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            required
            placeholder="e.g., 1000"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-purple-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Account"}
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
