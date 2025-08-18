import { CreateTransactionForm } from "./CreateTransactionForm";

interface TransactionsPageProps {
  onTransactionCreated: () => void;
}

export function TransactionsPage({
  onTransactionCreated,
}: TransactionsPageProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-gray-800 dark:text-white text-3xl font-bold text-center">
        Add Transaction
      </h1>
      <CreateTransactionForm onTransactionCreated={onTransactionCreated} />
    </div>
  );
}
