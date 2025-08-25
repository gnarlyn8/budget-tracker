import { NavigationButton } from "./shared/buttons/NavigationButton";
import { ActionButton } from "./shared/buttons/ActionButton";
import { MobileMenu } from "./MobileMenu";

interface AuthenticatedHeaderProps {
  userEmail: string;
  activeTab: "list" | "categories" | "transactions" | "show";
  showMobileMenu: boolean;
  onTabChange: (tab: "list" | "categories" | "transactions" | "show") => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
  onMobileMenuToggle: () => void;
}

export function AuthenticatedHeader({
  userEmail,
  activeTab,
  showMobileMenu,
  onTabChange,
  onHelpClick,
  onLogoutClick,
  onMobileMenuToggle,
}: AuthenticatedHeaderProps) {
  return (
    <header className="mb-8 bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <img
          src="/casapay-logo.png"
          alt="CasaPay"
          className="h-12 sm:h-16 lg:h-24 w-auto"
        />
        <div className="flex items-center gap-4 text-gray-300">
          <span className="text-sm sm:text-base">Welcome, {userEmail}</span>
          <div className="hidden sm:flex gap-2">
            <ActionButton variant="help" onClick={onHelpClick}>
              Help
            </ActionButton>
            <ActionButton variant="logout" onClick={onLogoutClick}>
              Logout
            </ActionButton>
          </div>
          <MobileMenu
            isOpen={showMobileMenu}
            onToggle={onMobileMenuToggle}
            onHelpClick={onHelpClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </div>

      <nav className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 flex-wrap">
        <NavigationButton
          isActive={activeTab === "list"}
          onClick={() => onTabChange("list")}
        >
          View Accounts
        </NavigationButton>
        <NavigationButton
          isActive={activeTab === "categories"}
          onClick={() => onTabChange("categories")}
        >
          View Budget Categories
        </NavigationButton>
        <NavigationButton
          isActive={activeTab === "transactions"}
          onClick={() => onTabChange("transactions")}
        >
          Add Transaction
        </NavigationButton>
      </nav>
    </header>
  );
}
