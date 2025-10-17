import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { Account } from "../Account";
import {
  GET_ACCOUNT,
  GET_ACCOUNTS,
  GET_BUDGET_CATEGORIES,
} from "../../../graphql/queries";
import { DELETE_TRANSACTION, DELETE_ACCOUNT } from "../../../graphql/mutations";
import { render } from "../../../test/utils";

const mockAccount = {
  id: "1",
  name: "Test Checking Account",
  accountType: "checking",
  startingBalance: 1000.0,
  currentBalance: 850.0,
  totalSpendingOrPayments: 150.0,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  transactions: [
    {
      id: "t1",
      accountId: "1",
      budgetCategoryId: "bc1",
      memo: "Grocery shopping",
      amount: -50.0,
      occurredOn: "2024-01-15T00:00:00Z",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      budgetCategory: {
        id: "bc1",
        name: "Groceries",
        amount: 500.0,
        description: "Food and household items",
        categoryType: "variable_expense",
      },
    },
    {
      id: "t2",
      accountId: "1",
      budgetCategoryId: "bc2",
      memo: "Salary deposit",
      amount: 2000.0,
      occurredOn: "2024-01-01T00:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      budgetCategory: {
        id: "bc2",
        name: "Income",
        amount: 5000.0,
        description: "Monthly salary",
        categoryType: "income",
      },
    },
    {
      id: "t3",
      accountId: "1",
      memo: "Cash withdrawal",
      amount: -100.0,
      occurredOn: "2024-01-10T00:00:00Z",
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      budgetCategory: null,
    },
  ],
};

const createMockGetAccountQuery = (account = mockAccount) => ({
  request: {
    query: GET_ACCOUNT,
    variables: { id: "1" },
  },
  result: {
    data: {
      account,
    },
  },
});

const mockDeleteTransactionMutation = {
  request: {
    query: DELETE_TRANSACTION,
    variables: { id: "t1" },
  },
  result: {
    data: {
      deleteTransaction: {
        success: true,
        errors: [],
      },
    },
  },
};

const mockDeleteAccountMutation = {
  request: {
    query: DELETE_ACCOUNT,
    variables: { id: "1" },
  },
  result: {
    data: {
      deleteAccount: {
        success: true,
        errors: [],
      },
    },
  },
};

const createMockGetAccountsQuery = () => ({
  request: {
    query: GET_ACCOUNTS,
  },
  result: {
    data: {
      accounts: [
        {
          id: "1",
          name: "Test Checking Account",
          accountType: "checking",
          startingBalance: 1000.0,
          currentBalance: 850.0,
          totalSpendingOrPayments: 150.0,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          transactions: [],
        },
      ],
    },
  },
});

const createMockGetBudgetCategoriesQuery = () => ({
  request: {
    query: GET_BUDGET_CATEGORIES,
  },
  result: {
    data: {
      budgetCategories: [],
    },
  },
});

describe("Account Component", () => {
  const mockOnBack = vi.fn();
  const mockOnAllAccountsRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).confirm = vi.fn(() => true);
    (window as any).scrollTo = vi.fn();
  });

  it("renders account information correctly", async () => {
    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    expect(screen.getByText("$1000.00")).toBeInTheDocument();
    expect(screen.getByText("$850.00")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
  });

  it("displays transactions grouped by category", async () => {
    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
    expect(screen.getByText("Grocery shopping")).toBeInTheDocument();
    expect(screen.getByText("Salary deposit")).toBeInTheDocument();
    expect(screen.getByText("Cash withdrawal")).toBeInTheDocument();
  });

  it("shows correct transaction amounts with proper formatting", async () => {
    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("-$50.00")).toBeInTheDocument();
    });

    expect(screen.getByText("+$2000.00")).toBeInTheDocument();
    expect(screen.getByText("-$100.00")).toBeInTheDocument();
  });

  it("displays category type badges correctly", async () => {
    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("variable expense")).toBeInTheDocument();
    });

    expect(screen.getByText("income")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    await user.click(screen.getByText("← Back to Accounts"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("toggles edit form when Edit Account button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button", { name: "Edit Account" });
    await user.click(editButton);

    const editCancelButton = document.querySelector(".edit-account-button");
    expect(editCancelButton?.textContent).toBe("Cancel");
    await user.click(editCancelButton!);
    expect(
      screen.getByRole("button", { name: "Edit Account" })
    ).toBeInTheDocument();
  });

  it("toggles transaction form when Add Transaction button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[
          createMockGetAccountQuery(),
          createMockGetBudgetCategoriesQuery(),
          createMockGetAccountsQuery(),
        ]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Add Transaction"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    const cancelButtons = screen.getAllByRole("button", { name: /cancel/i });
    await user.click(cancelButtons[cancelButtons.length - 1]);
    expect(screen.getByText("Add Transaction")).toBeInTheDocument();
  });

  it("deletes transaction when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[
          createMockGetAccountQuery(),
          mockDeleteTransactionMutation,
          createMockGetAccountsQuery(),
          createMockGetBudgetCategoriesQuery(),
          createMockGetAccountQuery(),
        ]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle("Delete transaction");
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Transaction deleted successfully!")
      ).toBeInTheDocument();
    });
  });

  it("deletes account when Delete Account button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[createMockGetAccountQuery(), mockDeleteAccountMutation]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Checking Account")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Delete Account"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("shows loading state initially", () => {
    render(
      <MockedProvider mocks={[createMockGetAccountQuery()]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    expect(screen.getByText("Loading account...")).toBeInTheDocument();
  });

  it("shows error state when query fails", async () => {
    const errorMock = {
      request: {
        query: GET_ACCOUNT,
        variables: { id: "1" },
      },
      result: {
        errors: [{ message: "GraphQL error" }],
      },
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading account/)).toBeInTheDocument();
    });
  });

  it("shows empty state when no transactions exist", async () => {
    const accountWithoutTransactions = {
      ...mockAccount,
      transactions: [],
    };

    render(
      <MockedProvider
        mocks={[createMockGetAccountQuery(accountWithoutTransactions)]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          "No transactions yet. Add your first transaction above!"
        )
      ).toBeInTheDocument();
    });
  });

  it("displays loan account type correctly", async () => {
    const loanAccount = {
      ...mockAccount,
      accountType: "loan",
    };

    render(
      <MockedProvider
        mocks={[createMockGetAccountQuery(loanAccount)]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Total Payments")).toBeInTheDocument();
    });
  });

  it("shows negative balance in red color", async () => {
    const negativeBalanceAccount = {
      ...mockAccount,
      currentBalance: -100.0,
    };

    render(
      <MockedProvider
        mocks={[createMockGetAccountQuery(negativeBalanceAccount)]}
        addTypename={false}
      >
        <Account
          accountId="1"
          onBack={mockOnBack}
          onAllAccountsRefresh={mockOnAllAccountsRefresh}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      const balanceElement = screen.getByText("-$100.00");
      expect(balanceElement).toHaveClass("text-red-500");
    });
  });
});
