import { useState } from "react";
import { AccountList } from "./AccountList";
import { CreateBankAccountForm } from "./CreateBankAccountForm";

interface AccountsPageProps {
  onAccountClick: (accountId: string) => void;
}

export function AccountsPage({ onAccountClick }: AccountsPageProps) {
  const [showAccountForm, setShowAccountForm] = useState(false);

  const handleToggleAccountForm = () => {
    const newState = !showAccountForm;
    setShowAccountForm(newState);

    if (newState) {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <h1 className="text-gray-800 dark:text-white text-3xl font-bold text-center">
          Your Accounts
        </h1>
        <AccountList onAccountClick={onAccountClick} />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleToggleAccountForm}
          className="!bg-teal-500 hover:!bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {showAccountForm ? "Cancel" : "Add New Account"}
        </button>
      </div>

      {showAccountForm && (
        <div className="mt-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-gray-800 dark:text-white text-2xl font-bold mb-6 text-center">
              Add New Account
            </h2>
            <CreateBankAccountForm />
          </div>
        </div>
      )}
    </div>
  );
}
