const API =
  import.meta.env.VITE_API_URL?.replace("/graphql", "") ??
  (import.meta.env.DEV ? "http://localhost:3000" : undefined);

let csrfToken: string | null = null;

export async function loadCsrf() {
  const r = await fetch(`${API}/auth/csrf`, { credentials: "include" });
  const data = await r.json();
  csrfToken = data.csrf_token;
}

function headersJSON() {
  if (!csrfToken) throw new Error("CSRF token not loaded");
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  };
}

export async function register(
  email: string,
  password: string,
  passwordConfirmation: string
) {
  if (!csrfToken) {
    await loadCsrf();
  }

  const r = await fetch(`${API}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: headersJSON(),
    body: JSON.stringify({
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function login(email: string, password: string) {
  if (!csrfToken) {
    await loadCsrf();
  }

  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: headersJSON(),
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function logout() {
  if (!csrfToken) {
    await loadCsrf();
  }

  const r = await fetch(`${API}/auth/logout`, {
    method: "DELETE",
    credentials: "include",
    headers: headersJSON(),
  });
  if (!r.ok) throw await r.json();
  return r.json();
}

export async function me() {
  const r = await fetch(`${API}/auth/me`, { credentials: "include" });
  if (!r.ok) return null;
  return r.json();
}

export async function graphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const r = await fetch(`${API}/graphql`, {
    method: "POST",
    credentials: "include",
    headers: headersJSON(),
    body: JSON.stringify({ query, variables }),
  });
  const json = await r.json();
  if (json.errors?.length) throw json.errors;
  return json.data;
}
