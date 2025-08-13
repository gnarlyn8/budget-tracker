import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountList } from "./components/AccountList";
import { CreateBankAccountForm } from "./components/CreateBankAccountForm";
import { Account } from "./components/Account";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "show">(
    "list"
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const { refetch: refetchAccounts } = useQuery(GET_ACCOUNTS);

  return (
    <div className="app">
      <header className="app-header">
        <h1>MicroBudget</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === "list" ? "active" : ""}
            onClick={() => setActiveTab("list")}
          >
            View Bank / Loan Accounts
          </button>
          <button
            className={activeTab === "create" ? "active" : ""}
            onClick={() => setActiveTab("create")}
          >
            Add New Bank / Loan Account
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "list" && (
          <AccountList
            onAccountClick={(accountId) => {
              setSelectedAccountId(accountId);
              setActiveTab("show");
            }}
          />
        )}
        {activeTab === "create" && <CreateBankAccountForm />}
        {activeTab === "show" && selectedAccountId && (
          <Account
            accountId={selectedAccountId}
            onBack={() => setActiveTab("list")}
            onAllAccountsRefresh={refetchAccounts}
          />
        )}
      </main>
    </div>
  );
}

export default App;
