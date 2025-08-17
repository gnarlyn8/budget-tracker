import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountList } from "./components/AccountList";
import { CreateBankAccountForm } from "./components/CreateBankAccountForm";
import { BudgetCategoriesPage } from "./components/BudgetCategoriesPage";
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
    document.documentElement.classList.add("dark");
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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen font-sans bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto p-8">
          <header className="text-center mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <img
              src="/casapay-logo.png"
              alt="CasaPay"
              className="h-24 w-auto m-0"
            />
          </header>
          <main className="min-h-96">
            <div className="text-center p-8 text-gray-600 dark:text-gray-400 text-lg">
              Loading...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen font-sans bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto p-8">
          <header className="text-center mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md relative">
            <img
              src="/casapay-logo.png"
              alt="CasaPay"
              className="h-24 w-auto m-0"
            />
          </header>
          <main className="min-h-96">
            <div className="max-w-md mx-auto">
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
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-sans bg-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <header className="text-center mb-8 bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <img
              src="/casapay-logo.png"
              alt="CasaPay"
              className="h-24 w-auto m-0"
            />
            <div className="flex items-center gap-4 text-gray-300">
              <span>Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white border-none rounded-md cursor-pointer text-sm transition-colors duration-300 hover:bg-gray-500"
              >
                Logout
              </button>
            </div>
          </div>
          <nav className="flex justify-center gap-4 flex-wrap">
            <button
              className={`px-6 py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "list" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("list")}
            >
              View Bank / Loan Accounts
            </button>
            <button
              className={`px-6 py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "categories" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("categories")}
            >
              View Budget Categories
            </button>
            <button
              className={`px-6 py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "create" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("create")}
            >
              Add New Bank / Loan Account
            </button>
            <button
              className={`px-6 py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "transactions" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Add Transaction
            </button>
          </nav>
        </header>

        <main className="min-h-96">
          <div className="max-w-6xl mx-auto">
            {activeTab === "list" && (
              <AccountList
                onAccountClick={(accountId) => {
                  setSelectedAccountId(accountId);
                  setActiveTab("show");
                }}
              />
            )}
            {activeTab === "categories" && <BudgetCategoriesPage />}
            {activeTab === "create" && <CreateBankAccountForm />}
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
    </div>
  );
}

export default App;
