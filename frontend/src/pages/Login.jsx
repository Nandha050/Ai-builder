import { useState } from "react";
import { loginUser } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

export default function Login({ onSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginUser({ email, password });
      onSuccess();
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthLayout title="AI Task Builder">
      <form onSubmit={handleSubmit}>
        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-2 mb-3 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        New user?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline"
        >
          Register
        </button>
      </p>
    </AuthLayout>
  );
}
