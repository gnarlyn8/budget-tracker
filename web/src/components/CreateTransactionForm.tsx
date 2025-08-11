import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations";

interface CreateTransactionFormProps {
  budgetCategoryId: string;
  onTransactionCreated: () => void;
}

export function CreateTransactionForm({
  budgetCategoryId,
  onTransactionCreated,
}: CreateTransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [createTransaction, { loading, error }] =
    useMutation(CREATE_TRANSACTION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTransaction({
        variables: {
          budgetCategoryId,
          description,
          amount: parseFloat(amount),
          date: date || null,
        },
      });

      setDescription("");
      setAmount("");
      setDate("");
      onTransactionCreated();
    } catch (err) {
      console.error("Error creating transaction:", err);
    }
  };

  return (
    <div className="create-transaction-form">
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="e.g., Grocery shopping, Movie tickets"
          />
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
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Leave empty for today"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Transaction"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
