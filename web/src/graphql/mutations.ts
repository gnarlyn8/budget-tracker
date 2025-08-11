import { gql } from "@apollo/client";

export const CREATE_BUDGET = gql`
  mutation CreateBudget($name: String!, $amount: Float!, $description: String) {
    createBudget(
      input: { name: $name, amount: $amount, description: $description }
    ) {
      budget {
        id
        name
        amount
        description
        createdAt
        updatedAt
      }
      errors
    }
  }
`;
