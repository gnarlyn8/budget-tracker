import { MockedProvider } from "@apollo/client/testing";
import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { GET_ACCOUNTS } from "../../../graphql/queries";
import { render } from "../../../test/utils";
import userEvent from "@testing-library/user-event";
import { AccountsPage } from "../AccountsPage";

const mockGetAccountsQuery = {
  request: {
    query: GET_ACCOUNTS,
  },
  result: {
    data: { accounts: [] },
  },
};

describe("AccountsPage", () => {
  it("renders the page with the correct title", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountsPage onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Your Accounts")).toBeInTheDocument();
    });
  });
  it("shows add account button when new account form is not shown", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountsPage onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Add New Account")).toBeInTheDocument();
    });
  });
  it("shows cancel button when new account form is shown", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountsPage onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await userEvent.click(screen.getByText("Add New Account"));

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
  it("shows create account form when new account button is clicked", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountsPage onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await userEvent.click(screen.getByText("Add New Account"));
    await waitFor(() => {
      expect(screen.getByText("Add New Account")).toBeInTheDocument();
    });
  });
  it("hides create account form when cancel button is clicked", async () => {
    render(
      <MockedProvider mocks={[mockGetAccountsQuery]} addTypename={false}>
        <AccountsPage onAccountClick={vi.fn()} />
      </MockedProvider>
    );
    await userEvent.click(screen.getByText("Add New Account"));
    await userEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(
        screen.queryByText("Create New Bank Account")
      ).not.toBeInTheDocument();
    });
  });
});
