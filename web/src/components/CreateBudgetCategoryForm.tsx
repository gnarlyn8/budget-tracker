import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BUDGET_CATEGORY } from "../graphql/mutations";

interface CreateBudgetCategoryFormProps {
  budgetId: string;
  onBudgetCategoryCreated: () => void;
}

export function CreateBudgetCategoryForm({
  budgetId,
  onBudgetCategoryCreated,
}: CreateBudgetCategoryFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("variable_expense");

  const [createBudgetCategory, { loading, error }] = useMutation(
    CREATE_BUDGET_CATEGORY
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createBudgetCategory({
        variables: {
          budgetId,
          name,
          amount: parseFloat(amount),
          description: description || null,
          categoryType,
        },
      });

      setName("");
      setAmount("");
      setDescription("");
      setCategoryType("variable_expense");
      onBudgetCategoryCreated();
    } catch (err) {
      console.error("Error creating budget category:", err);
    }
  };

  return (
    <div className="create-budget-category-form">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Groceries, Entertainment, Mortgage"
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
            <option value="fixed_payment">Variable Expense</option>
            <option value="debt_repayment">Debt Repayment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ($):</label>
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
          {loading ? "Adding..." : "Add Category"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
