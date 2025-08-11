import { gql } from "@apollo/client";

export const GET_BUDGETS = gql`
  query GetBudgets {
    budgets {
      id
      name
      amount
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUDGET = gql`
  query GetBudget($id: ID!) {
    budget(id: $id) {
      id
      name
      amount
      description
      createdAt
      updatedAt
    }
  }
`;
