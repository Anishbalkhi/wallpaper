import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl w-full max-w-sm space-y-6 border border-gray-700 shadow-[0_0_20px_#00ffff]"
      >
        <h1 className="text-2xl font-bold text-center text-cyan-400 drop-shadow-lg">
          Login
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-cyan-500 bg-gray-800 text-white placeholder-cyan-400 p-3 rounded-lg focus:ring-2 focus:ring-cyan-400 outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg shadow-[0_0_10px_#00ffff] transition flex items-center justify-center"
        >
          Login
        </button>
      </form>
    </div>
  );
}
