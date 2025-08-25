import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (import.meta.env.DEV) {
  loadDevMessages();
  loadErrorMessages();
}

const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/graphql"
  : import.meta.env.VITE_API_URL;

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_URL?.replace("/graphql", "");

const httpLink = createHttpLink({
  uri: API_URL,
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  let csrfToken = null;

  try {
    const response = await fetch(`${BASE_URL}/auth/csrf`, {
      credentials: "include",
    });
    const data = await response.json();
    csrfToken = data.csrf_token;
  } catch (error) {
    console.error("Failed to load CSRF token:", error);
  }

  return {
    headers: {
      ...headers,
      "X-CSRF-Token": csrfToken,
    },
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
