import { useState } from "react";
import { BudgetCategoryList } from "./BudgetCategoryList";
import { CreateBudgetCategoryForm } from "./CreateBudgetCategoryForm";

export function BudgetCategoriesPage() {
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleToggleCategoryForm = () => {
    const newState = !showCategoryForm;
    setShowCategoryForm(newState);

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
      <div>
        <h1 className="text-gray-800 dark:text-white text-3xl font-bold text-center">
          Budget Categories
        </h1>
        <BudgetCategoryList />
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleToggleCategoryForm}
          className="!bg-teal-500 hover:!bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          {showCategoryForm ? "Cancel" : "Add Budget Category"}
        </button>
      </div>

      {showCategoryForm && (
        <div className="mt-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-gray-800 dark:text-white text-2xl font-bold mb-6 text-center">
              Add New Budget Category
            </h2>
            <CreateBudgetCategoryForm />
          </div>
        </div>
      )}
    </div>
  );
}
