import { useState } from "react";
import { registerUser } from "../api/authApi";
import AuthLayout from "../components/AuthLayout";

export default function Register({ onSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ name, email, password });
      onSuccess();
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <AuthLayout title="Create Account">
      <form onSubmit={handleSubmit}>
        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

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
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:underline"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
}
