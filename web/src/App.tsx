import { useState } from "react";
import { BudgetList } from "./components/BudgetList";
import { CreateBudgetForm } from "./components/CreateBudgetForm";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

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
        {activeTab === "list" ? <BudgetList /> : <CreateBudgetForm />}
      </main>
    </div>
  );
}

export default App;
