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

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
});

const authLink = setContext(async (_, { headers }) => {
  let csrfToken = null;

  try {
    const response = await fetch("http://localhost:3000/auth/csrf", {
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
