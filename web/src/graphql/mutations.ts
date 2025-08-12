import { gql } from "@apollo/client";

export const CREATE_BUDGET = gql`
  mutation CreateBudget($name: String!, $description: String) {
    createBudget(input: { name: $name, description: $description }) {
      budget {
        id
        name
        description
        totalAmount
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const CREATE_BUDGET_CATEGORY = gql`
  mutation CreateBudgetCategory(
    $budgetId: ID!
    $name: String!
    $amount: Float!
    $description: String
    $categoryType: String
  ) {
    createBudgetCategory(
      input: {
        budgetId: $budgetId
        name: $name
        amount: $amount
        description: $description
        categoryType: $categoryType
      }
    ) {
      budgetCategory {
        id
        budgetId
        name
        amount
        description
        categoryType
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $budgetCategoryId: ID!
    $description: String!
    $amount: Float!
    $date: ISO8601DateTime
  ) {
    createTransaction(
      input: {
        budgetCategoryId: $budgetCategoryId
        description: $description
        amount: $amount
        date: $date
      }
    ) {
      transaction {
        id
        budgetCategoryId
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
