import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountList } from "./components/AccountList";
import { CreateBankAccountForm } from "./components/CreateBankAccountForm";
import { CreateBudgetCategoryForm } from "./components/CreateBudgetCategoryForm";
import { CreateTransactionForm } from "./components/CreateTransactionForm";
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "list" | "create" | "categories" | "transactions" | "show"
  >("list");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="app">
        <header className="app-header">
          <img src="/casapay-logo.png" alt="CasaPay" className="app-logo" />
        </header>
        <main className="app-main">
          <div className="loading">Loading...</div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <img src="/casapay-logo.png" alt="CasaPay" className="app-logo" />
          <button onClick={toggleTheme} className="theme-toggle">
            <div className={`theme-slider ${isDarkMode ? "dark" : "light"}`}>
              <span className="theme-icon">☀️</span>
              <span className="theme-icon">🌙</span>
            </div>
          </button>
        </header>
        <main className="app-main">
          <div className="auth-container">
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <img
            src="../public/casapay-logo.png"
            alt="CasaPay"
            className="app-logo"
          />
          <div className="header-controls">
            <button onClick={toggleTheme} className="theme-toggle">
              <div className={`theme-slider ${isDarkMode ? "dark" : "light"}`}>
                <span className="theme-icon">☀️</span>
                <span className="theme-icon">🌙</span>
              </div>
            </button>
            <div className="user-info">
              <span>Welcome, {user?.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
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
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Add Transaction
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="content-container">
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
          {activeTab === "transactions" && (
            <CreateTransactionForm onTransactionCreated={refetchAccounts} />
          )}
          {activeTab === "show" && selectedAccountId && (
            <Account
              accountId={selectedAccountId}
              onBack={() => setActiveTab("list")}
              onAllAccountsRefresh={refetchAccounts}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
