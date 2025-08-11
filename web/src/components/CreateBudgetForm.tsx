import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { CREATE_BUDGET } from "../graphql/mutations";
import { GET_BUDGETS } from "../graphql/queries";

export function CreateBudgetForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const client = useApolloClient();

  const [createBudget, { loading, error }] = useMutation(CREATE_BUDGET);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createBudget({
        variables: {
          name,
          description: description || null,
        },
      });

      const existingData = client.readQuery({ query: GET_BUDGETS });
      if (existingData) {
        client.writeQuery({
          query: GET_BUDGETS,
          data: {
            budgets: [...existingData.budgets, result.data.createBudget.budget],
          },
        });
      }

      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating budget:", err);
    }
  };

  return (
    <div className="create-budget-form">
      <h2>Create New Budget</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Budget Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Monthly Budget, Vacation Budget"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for this budget..."
            rows={3}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Budget"}
        </button>

        {error && <p className="error">Error: {error.message}</p>}
      </form>
    </div>
  );
}
