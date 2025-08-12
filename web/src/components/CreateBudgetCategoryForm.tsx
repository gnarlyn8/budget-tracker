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
    <div className="create-budget-category-form">
      <h2>Create New Budget Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Groceries, Entertainment, Credit Card Payment"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryType">Category Type:</label>
          <select
            id="categoryType"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            required
          >
            <option value="variable_expense">Variable Expense</option>
            <option value="debt_repayment">Debt Repayment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Budget Amount ($):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this category..."
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Category"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
