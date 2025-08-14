import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountList } from "./components/AccountList";
import { CreateBankAccountForm } from "./components/CreateBankAccountForm";
import { CreateBudgetCategoryForm } from "./components/CreateBudgetCategoryForm";
import { Account } from "./components/Account";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { loadCsrf, me, logout } from "./authentication/api";
import "./App.css";

interface User {
  email: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<
    "list" | "create" | "categories" | "show"
  >("list");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );

  const { refetch: refetchAccounts } = useQuery(GET_ACCOUNTS);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await loadCsrf();
        const user = await me();
        setUser(user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>MicroBudget</h1>
        </header>
        <main className="app-main">
          {authMode === "login" ? (
            <LoginForm
              onLoginSuccess={() => setIsAuthenticated(true)}
              onSwitchToSignup={() => setAuthMode("signup")}
            />
          ) : (
            <SignupForm
              onSignupSuccess={() => setIsAuthenticated(true)}
              onSwitchToLogin={() => setAuthMode("login")}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MicroBudget</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
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
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            Add Budget Categories
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
        {activeTab === "categories" && <CreateBudgetCategoryForm />}
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
