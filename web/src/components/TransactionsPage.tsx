import { CreateTransactionForm } from "./CreateTransactionForm";

interface TransactionsPageProps {
  onTransactionCreated: () => void;
}

export function TransactionsPage({
  onTransactionCreated,
}: TransactionsPageProps) {
  return (
    <div className="w-full">
      <h1 className="text-gray-800 dark:text-white text-3xl font-bold mb-6 text-center">
        Add Transaction
      </h1>
      <CreateTransactionForm onTransactionCreated={onTransactionCreated} />
    </div>
  );
}
