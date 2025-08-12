import { useState } from "react";
import { AccountList } from "./components/AccountList";
import { CreateTransactionForm } from "./components/CreateTransactionForm";
import { Account } from "./components/Account";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "show">(
    "list"
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>MicroBudget</h1>
        <nav className="nav-tabs">
          <button
            className={activeTab === "list" ? "active" : ""}
            onClick={() => setActiveTab("list")}
          >
            View Budgets
          </button>
          <button
            className={activeTab === "create" ? "active" : ""}
            onClick={() => setActiveTab("create")}
          >
            Create Budget
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
        {activeTab === "create" && (
          <CreateTransactionForm
            onTransactionCreated={() => setActiveTab("list")}
          />
        )}
        {activeTab === "show" && selectedAccountId && (
          <Account
            accountId={selectedAccountId}
            onBack={() => setActiveTab("list")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
