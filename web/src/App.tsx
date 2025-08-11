import { useState } from "react";
import { BudgetList } from "./components/BudgetList";
import { CreateBudgetForm } from "./components/CreateBudgetForm";
import { Budget } from "./components/Budget";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "show">(
    "list"
  );
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

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
          <BudgetList
            onBudgetClick={(budgetId) => {
              setSelectedBudgetId(budgetId);
              setActiveTab("show");
            }}
          />
        )}
        {activeTab === "create" && <CreateBudgetForm />}
        {activeTab === "show" && selectedBudgetId && (
          <Budget
            budgetId={selectedBudgetId}
            onBack={() => setActiveTab("list")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
