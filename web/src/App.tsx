import { useEffect, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountsPage } from "./components/AccountsPage";
import { BudgetCategoriesPage } from "./components/BudgetCategoriesPage";
import { TransactionsPage } from "./components/TransactionsPage";
import { Account } from "./components/Account";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { HelpModal } from "./components/HelpModal";
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
    "list" | "categories" | "transactions" | "show"
  >("list");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const client = useApolloClient();
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
  }, [client]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      await client.resetStore();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleLoginSuccess = async () => {
    try {
      const user = await me();
      setUser(user);
      setIsAuthenticated(true);
      await client.resetStore();
    } catch (error) {
      console.error("Failed to get user after login:", error);
    }
  };

  const handleSignupSuccess = async () => {
    try {
      const user = await me();
      setUser(user);
      setIsAuthenticated(true);
      await client.resetStore();
    } catch (error) {
      console.error("Failed to get user after signup:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen font-sans bg-gray-900">
        <div className="max-w-6xl mx-auto p-8">
          <header className="text-center mb-8 bg-gray-800 p-6 rounded-xl shadow-md">
            <img
              src="/casapay-logo.png"
              alt="CasaPay"
              className="h-24 w-auto m-0"
            />
          </header>
          <main className="min-h-96">
            <div className="text-center p-8 text-gray-400 text-lg">
              Loading...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen font-sans bg-gray-900">
        <div className="max-w-6xl mx-auto p-8">
          <header className="text-center mb-8 bg-gray-800 p-6 rounded-xl shadow-md relative">
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
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToSignup={() => setAuthMode("signup")}
                />
              ) : (
                <SignupForm
                  onSignupSuccess={handleSignupSuccess}
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
    <div className="min-h-screen font-sans bg-gray-900">
      <div className="max-w-5xl mx-auto px-8 py-8">
        <header className="text-center mb-8 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <img
              src="/casapay-logo.png"
              alt="CasaPay"
              className="h-12 sm:h-16 lg:h-24 w-auto"
            />
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-sm sm:text-base">
                Welcome, {user?.email}
              </span>
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setShowHelp(true)}
                  className="px-3 py-2 bg-purple-600 text-white border-none rounded-md cursor-pointer text-sm transition-colors duration-300 hover:bg-purple-500"
                >
                  Help
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-gray-600 text-white border-none rounded-md cursor-pointer text-sm transition-colors duration-300 hover:bg-gray-500"
                >
                  Logout
                </button>
              </div>
              <div className="sm:hidden relative">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 text-gray-300 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                {showMobileMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600 min-w-[120px] z-10">
                    <button
                      onClick={() => {
                        setShowHelp(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200 !bg-gray-700 border border-gray-800 rounded-t-lg"
                    >
                      Help
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-600 hover:text-white transition-colors duration-200 !bg-gray-700 border border-gray-800 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 flex-wrap">
            <button
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-sm sm:text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "list" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("list")}
            >
              View Accounts
            </button>
            <button
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-sm sm:text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "categories" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("categories")}
            >
              View Budget Categories
            </button>

            <button
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-2 border-purple-500 bg-transparent text-purple-500 rounded-lg cursor-pointer text-sm sm:text-base transition-all duration-300 hover:bg-purple-500 hover:text-white ${
                activeTab === "transactions" ? "bg-purple-500 text-white" : ""
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Add Transaction
            </button>
          </nav>
        </header>

        <main className="min-h-96">
          {activeTab === "list" && (
            <AccountsPage
              onAccountClick={(accountId) => {
                setSelectedAccountId(accountId);
                setActiveTab("show");
              }}
            />
          )}
          {activeTab === "categories" && <BudgetCategoriesPage />}
          {activeTab === "transactions" && (
            <TransactionsPage onTransactionCreated={refetchAccounts} />
          )}
          {activeTab === "show" && selectedAccountId && (
            <Account
              accountId={selectedAccountId}
              onBack={() => setActiveTab("list")}
              onAllAccountsRefresh={refetchAccounts}
            />
          )}
        </main>
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App;
