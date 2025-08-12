import { gql } from "@apollo/client";

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
      accountType
      startingBalance
      currentBalance
      createdAt
      updatedAt
      transactions {
        id
        amount
        occurredOn
        memo
        createdAt
        updatedAt
        budgetCategory {
          id
          name
          categoryType
        }
      }
    }
  }
`;

export const GET_ACCOUNT = gql`
  query GetAccount($id: ID!) {
    account(id: $id) {
      id
      name
      accountType
      startingBalance
      currentBalance
      createdAt
      updatedAt
      transactions {
        id
        amount
        occurredOn
        memo
        createdAt
        updatedAt
        budgetCategory {
          id
          name
          amount
          description
          categoryType
        }
      }
    }
  }
`;

export const GET_BUDGET_CATEGORIES = gql`
  query GetBudgetCategories {
    budgetCategories {
      id
      name
      amount
      description
      categoryType
      createdAt
      updatedAt
      transactions {
        id
        amount
        memo
        occurredOn
      }
    }
  }
`;

export const GET_BUDGET_CATEGORY = gql`
  query GetBudgetCategory($id: ID!) {
    budgetCategory(id: $id) {
      id
      name
      amount
      description
      categoryType
      createdAt
      updatedAt
      transactions {
        id
        amount
        occurredOn
        memo
        createdAt
        updatedAt
        account {
          id
          name
          accountType
        }
      }
    }
  }
`;
