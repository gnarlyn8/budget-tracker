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
import { NavigationButton } from "./components/NavigationButton";
import { MobileMenu } from "./components/MobileMenu";
import { ActionButton } from "./components/ActionButton";
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
                <ActionButton variant="help" onClick={() => setShowHelp(true)}>
                  Help
                </ActionButton>
                <ActionButton variant="logout" onClick={handleLogout}>
                  Logout
                </ActionButton>
              </div>
              <MobileMenu
                isOpen={showMobileMenu}
                onToggle={() => setShowMobileMenu(!showMobileMenu)}
                onHelpClick={() => setShowHelp(true)}
                onLogoutClick={handleLogout}
              />
            </div>
          </div>

          <nav className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 flex-wrap">
            <NavigationButton
              isActive={activeTab === "list"}
              onClick={() => setActiveTab("list")}
            >
              View Accounts
            </NavigationButton>
            <NavigationButton
              isActive={activeTab === "categories"}
              onClick={() => setActiveTab("categories")}
            >
              View Budget Categories
            </NavigationButton>
            <NavigationButton
              isActive={activeTab === "transactions"}
              onClick={() => setActiveTab("transactions")}
            >
              Add Transaction
            </NavigationButton>
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
