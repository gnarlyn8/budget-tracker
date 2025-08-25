import { useEffect, useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_ACCOUNTS } from "./graphql/queries";
import { AccountsPage } from "./components/accounts/AccountsPage";
import { BudgetCategoriesPage } from "./components/budget-categories/BudgetCategoriesPage";
import { TransactionsPage } from "./components/transactions/TransactionsPage";
import { Account } from "./components/accounts/Account";
import { LoginForm } from "./components/shared/forms/LoginForm";
import { SignupForm } from "./components/shared/forms/SignupForm";
import { HelpModal } from "./components/HelpModal";
import { Header } from "./components/Header";
import { AuthenticatedHeader } from "./components/AuthenticatedHeader";
import { PageWrapper } from "./components/PageWrapper";
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
      <PageWrapper>
        <Header />
        <main className="min-h-96">
          <div className="text-center p-8 text-gray-400 text-lg">
            Loading...
          </div>
        </main>
      </PageWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <Header />
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="5xl">
      <div className="px-0 py-8">
        <AuthenticatedHeader
          userEmail={user?.email || ""}
          activeTab={activeTab}
          showMobileMenu={showMobileMenu}
          onTabChange={setActiveTab}
          onHelpClick={() => setShowHelp(true)}
          onLogoutClick={handleLogout}
          onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        />

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
    </PageWrapper>
  );
}

export default App;
