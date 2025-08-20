interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-100 text-xl font-semibold">
            How to Use Budget Tracker
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-purple-400 font-semibold text-lg mb-3">
              Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Create your monthly budget account</strong> - This will
                be your primary income source
              </li>
              <li>
                <strong>Add loan/repayment accounts</strong> - Create separate
                accounts for each loan or debt you want to track
              </li>
              <li>
                <strong>Set up budget categories</strong> - Create categories
                for non-loan expenses (groceries, utilities, etc.)
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-purple-400 font-semibold text-lg mb-3">
              Managing Your Budget
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Monthly Budget Account:</strong> This represents your
                income and is reduced by all transactions
              </li>
              <li>
                <strong>Loan Accounts:</strong> Track individual loans and their
                repayments
              </li>
              <li>
                <strong>Budget Categories:</strong> Organize other expenses that
                aren't loan-related
              </li>
              <li>
                <strong>Transactions:</strong> Add income and expenses that
                affect your accounts
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-purple-400 font-semibold text-lg mb-3">
              Key Features
            </h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Edit and delete</strong> all accounts, transactions, and
                budget categories
              </li>
              <li>
                <strong>Track spending</strong> across different categories
              </li>
              <li>
                <strong>Monitor loan repayments</strong> separately from other
                expenses
              </li>
              <li>
                <strong>Real-time updates</strong> as you add or modify
                transactions
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-purple-400 font-semibold text-lg mb-3">
              Workflow
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed">
              <li>Add your monthly income to your budget account</li>
              <li>Create loan accounts for each debt you're tracking</li>
              <li>Set up budget categories for regular expenses</li>
              <li>Record transactions as they occur</li>
              <li>Monitor your spending and loan repayment progress</li>
            </ol>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-purple-500 text-white border-none rounded-lg cursor-pointer text-base font-medium transition-colors duration-300 hover:bg-purple-600"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
