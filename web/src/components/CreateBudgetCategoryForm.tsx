import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { CREATE_BUDGET_CATEGORY } from "../graphql/mutations";
import { GET_BUDGET_CATEGORIES } from "../graphql/queries";
import { Notification } from "./Notification";

interface CreateBudgetCategoryFormProps {
  onCategoryCreated?: () => void;
}

export function CreateBudgetCategoryForm({
  onCategoryCreated,
}: CreateBudgetCategoryFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("variable_expense");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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
      setNotification({
        message: "Budget category created successfully!",
        type: "success",
      });
      onCategoryCreated?.();
    } catch (err) {
      console.error("Error creating budget category:", err);
      setNotification({
        message: "Failed to create budget category. Please try again.",
        type: "error",
      });
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
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 cursor-pointer focus:outline-none focus:border-purple-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"
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
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
