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
        },
      });

      setName("");
      setAmount("");
      setDescription("");
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
            placeholder="e.g., Groceries, Entertainment"
          />
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
          {loading ? "Adding..." : "Add Category"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
