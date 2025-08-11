import { useState } from "react";
import { BudgetList } from "./components/BudgetList";
import { CreateBudgetForm } from "./components/CreateBudgetForm";
import { Budget } from "./components/Budget";
import { BudgetCategory } from "./components/BudgetCategory";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<
    "list" | "create" | "show" | "category"
  >("list");
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
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
            onCategoryClick={(categoryId: string) => {
              setSelectedCategoryId(categoryId);
              setActiveTab("category");
            }}
          />
        )}
        {activeTab === "category" && selectedCategoryId && (
          <BudgetCategory
            categoryId={selectedCategoryId}
            onBack={() => setActiveTab("show")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
