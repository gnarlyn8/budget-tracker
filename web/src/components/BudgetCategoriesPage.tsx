import { BudgetCategoryList } from "./BudgetCategoryList";
import { CreateBudgetCategoryForm } from "./CreateBudgetCategoryForm";

export function BudgetCategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-800 dark:text-white text-3xl font-bold mb-6 text-center">
          Budget Categories
        </h1>
        <BudgetCategoryList />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-gray-800 dark:text-white text-2xl font-bold mb-6 text-center">
          Add New Budget Category
        </h2>
        <CreateBudgetCategoryForm />
      </div>
    </div>
  );
}
