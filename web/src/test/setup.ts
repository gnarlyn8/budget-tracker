import "@testing-library/jest-dom";

// Suppress Apollo error logging in tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Error loading account") ||
      args[0].includes("ApolloError") ||
      args[0].includes("GraphQL error"))
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
