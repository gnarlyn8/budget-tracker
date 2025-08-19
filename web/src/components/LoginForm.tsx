import { useState } from "react";
import { login } from "../authentication/api";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({
  onLoginSuccess,
  onSwitchToSignup,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-md">
      <h2 className="text-gray-100 text-xl font-semibold mb-6 text-center">
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-gray-300 font-medium"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-gray-300 font-medium"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your password"
            className="w-full p-3 border-2 border-gray-600 rounded-lg text-base transition-colors duration-300 box-border bg-gray-700 text-gray-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-purple-500 text-white border-none rounded-lg text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-purple-400 hover:text-purple-300 font-medium focus:outline-none focus:underline"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
