import { gql } from "@apollo/client";

export const GET_BUDGETS = gql`
  query GetBudgets {
    budgets {
      id
      name
      description
      totalAmount
      createdAt
      updatedAt
      budgetCategories {
        id
        name
        amount
        description
        categoryType
        transactions {
          id
          amount
        }
      }
    }
  }
`;

export const GET_BUDGET = gql`
  query GetBudget($id: ID!) {
    budget(id: $id) {
      id
      name
      description
      totalAmount
      createdAt
      updatedAt
      budgetCategories {
        id
        name
        amount
        description
        categoryType
        transactions {
          id
          budgetCategoryId
          description
          amount
          date
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_BUDGET_CATEGORY = gql`
  query GetBudgetCategory($id: ID!) {
    budgetCategory(id: $id) {
      id
      budgetId
      name
      amount
      description
      categoryType
      createdAt
      updatedAt
      transactions {
        id
        budgetCategoryId
        description
        amount
        date
        createdAt
        updatedAt
      }
    }
  }
`;
