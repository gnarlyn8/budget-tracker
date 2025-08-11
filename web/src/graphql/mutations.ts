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

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $budgetId: ID!
    $description: String!
    $amount: Float!
    $date: ISO8601DateTime
  ) {
    createTransaction(
      input: {
        budgetId: $budgetId
        description: $description
        amount: $amount
        date: $date
      }
    ) {
      transaction {
        id
        budgetId
        description
        amount
        date
        createdAt
        updatedAt
      }
      errors
    }
  }
`;
