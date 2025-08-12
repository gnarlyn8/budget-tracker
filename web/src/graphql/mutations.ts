import { gql } from "@apollo/client";

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount(
    $name: String!
    $accountType: String!
    $startingBalance: Float
  ) {
    createAccount(
      input: {
        name: $name
        accountType: $accountType
        startingBalance: $startingBalance
      }
    ) {
      account {
        id
        name
        accountType
        startingBalance
        currentBalance
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount(
    $id: ID!
    $name: String
    $accountType: String
    $startingBalance: Float
  ) {
    updateAccount(
      input: {
        id: $id
        name: $name
        accountType: $accountType
        startingBalance: $startingBalance
      }
    ) {
      account {
        id
        name
        accountType
        startingBalance
        currentBalance
        createdAt
        updatedAt
      }
      errors
    }
  }
`;

export const CREATE_BUDGET_CATEGORY = gql`
  mutation CreateBudgetCategory(
    $name: String!
    $amount: Float!
    $description: String
    $categoryType: String
  ) {
    createBudgetCategory(
      input: {
        name: $name
        amount: $amount
        description: $description
        categoryType: $categoryType
      }
    ) {
      budgetCategory {
        id
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
    $accountId: ID!
    $budgetCategoryId: ID
    $memo: String!
    $amount: Float!
    $occurredOn: ISO8601Date
  ) {
    createTransaction(
      input: {
        accountId: $accountId
        budgetCategoryId: $budgetCategoryId
        memo: $memo
        amount: $amount
        occurredOn: $occurredOn
      }
    ) {
      transaction {
        id
        accountId
        budgetCategoryId
        memo
        amount
        occurredOn
        createdAt
        updatedAt
      }
      errors
    }
  }
`;
