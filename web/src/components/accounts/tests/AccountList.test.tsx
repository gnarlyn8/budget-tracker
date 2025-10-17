import { MockedProvider } from "@apollo/client/testing";
import { describe, it, expect, vi } from "vitest";
import { AccountList } from "../AccountList";
import { screen, waitFor } from "@testing-library/react";
import { GET_ACCOUNTS } from "../../../graphql/queries";
import { render } from "../../../test/utils";

const mockGetAccountsQuery = {
  request: {
    query: GET_ACCOUNTS,
  },
  result: {
    data: {
      accounts: [
        {
          id: "1",
          name: "Test Checking Account",
          accountType: "monthly_budget",
          startingBalance: 1000.0,
          currentBalance: 850.0,
          totalSpendingOrPayments: 150.0,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          transactions: [],
        },
        {
          id: "1",
          name: "Test Loan Account",
          accountType: "loan",
          startingBalance: 5000.0,
          currentBalance: 3850.0,
          totalSpendingOrPayments: 150.0,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          transactions: [],
        },
        {
          id: "1",
          name: "Test Loan Account 2",
          accountType: "loan",
          startingBalance: 2000.0,
          currentBalance: 1850.0,
          totalSpendingOrPayments: 150.0,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          transactions: [],
        },
      ],
    },
  },
};

const mockGetAccountsQueryEmpty = {
  request: {
    query: GET_ACCOUNTS,
  },
  result: {
    data: { accounts: [] },
  },
};
describe("AccountList", () => {
  it("renders accounts", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountList onAccountClick={vi.fn()} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
      expect(screen.getByText("Test Loan Account")).toBeInTheDocument();
      expect(screen.getByText("Test Loan Account 2")).toBeInTheDocument();
    });
  });
  it("renders empty state when no accounts are found", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQueryEmpty]} addTypename={false}>
        <AccountList onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByText("No accounts found. Create your first account!")
      ).toBeInTheDocument();
    });
  });

  it("renders account card with correct information", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountList onAccountClick={vi.fn()} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    expect(screen.getByText("Starting: $1000.00")).toBeInTheDocument();
    expect(screen.getByText("Current: $850.00")).toBeInTheDocument();
    expect(screen.getByText("MONTHLY BUDGET")).toBeInTheDocument();
    expect(screen.getAllByText("LOAN")).toHaveLength(2);
    expect(screen.getAllByText("No transactions yet")).toHaveLength(3);
    expect(screen.getAllByText("0 total transactions")).toHaveLength(3);
  });
});
