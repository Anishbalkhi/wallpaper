import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/signup", { name, email, password });
      alert("✅ Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data?.msg);
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl w-full max-w-sm space-y-6 border border-gray-700 shadow-[0_0_20px_#ff00ff]"
      >
        <h1 className="text-2xl font-bold text-center text-pink-400 drop-shadow-lg">
          Signup
        </h1>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-pink-500 bg-gray-800 text-white placeholder-pink-400 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-pink-500 bg-gray-800 text-white placeholder-pink-400 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-pink-500 bg-gray-800 text-white placeholder-pink-400 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-lg shadow-[0_0_10px_#ff00ff] transition flex items-center justify-center"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
