import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
