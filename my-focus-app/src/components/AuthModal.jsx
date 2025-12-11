import { useState } from "react";
import { supabase } from "../supabase";

export default function AuthModal({ onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let result;

    try {
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
        });
      }

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      onAuth(result.data.user);
      onClose();
    } catch (err) {
      alert("Something went wrong. Try again.");
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white/60 p-6 rounded-xl w-full max-w-sm shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-red-500 text-white py-2 rounded-md font-medium"
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p
          className="mt-4 text-center text-blue-600 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create new account" : "Already have an account? Login"}
        </p>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 border rounded-md text-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
