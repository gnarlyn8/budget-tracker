import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { CREATE_BUDGET_CATEGORY } from "../graphql/mutations";
import { GET_BUDGET_CATEGORIES } from "../graphql/queries";

export function CreateBudgetCategoryForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("variable_expense");
  const client = useApolloClient();

  const [createBudgetCategory, { loading, error }] = useMutation(
    CREATE_BUDGET_CATEGORY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createBudgetCategory({
        variables: {
          name,
          amount: parseFloat(amount),
          description: description || null,
          categoryType,
        },
      });

      const existingData = client.readQuery({ query: GET_BUDGET_CATEGORIES });
      if (existingData) {
        client.writeQuery({
          query: GET_BUDGET_CATEGORIES,
          data: {
            budgetCategories: [
              ...existingData.budgetCategories,
              result.data.createBudgetCategory.budgetCategory,
            ],
          },
        });
      }

      setName("");
      setAmount("");
      setDescription("");
      setCategoryType("variable_expense");
    } catch (err) {
      console.error("Error creating budget category:", err);
    }
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-md">
      <h2 className="text-gray-100 text-xl font-semibold mb-6 text-center">
        Create New Budget Category
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-gray-300 font-medium"
          >
            Category Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Groceries, Entertainment, Credit Card Payment"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="categoryType"
            className="block mb-2 text-gray-300 font-medium"
          >
            Category Type:
          </label>
          <select
            id="categoryType"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer appearance-none bg-no-repeat bg-right-3 bg-center bg-4 pr-10 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
            }}
          >
            <option value="variable_expense">Variable Expense</option>
            <option value="debt_repayment">Debt Repayment</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="amount"
            className="block mb-2 text-gray-300 font-medium"
          >
            Budget Amount ($):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-gray-300 font-medium"
          >
            Description (optional):
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this category..."
            rows={3}
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-purple-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Category"}
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
