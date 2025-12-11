import { useState } from "react";
import { signIn, signUp } from "../auth";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setMsg("");
    setLoading(true);

    const fn = mode === "login" ? signIn : signUp;
    const { data, error } = await fn(email, password);

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      setMsg("Account created! Check email for verification.");
    } else {
      setMsg("Success! Logging you in...");
    }

    setLoading(false);
    onLogin(); // tell App.jsx to reload user session
  };

  return (
    <div
      className="p-6 card w-80 mx-auto mt-20 text-center rounded-lg"
      style={{
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        className="font-semibold mb-4 text-xl"
        style={{ color: "var(--primary)" }}
      >
        {mode === "login" ? "Login" : "Create Account"}
      </h2>

      <input
        className="w-full p-2 border rounded mb-3"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          borderColor: "var(--border)",
        }}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full p-2 border rounded mb-4"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
          borderColor: "var(--border)",
        }}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full py-2 rounded text-white"
        style={{
          background: "var(--primary)",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
      </button>

      <div
        className="text-sm cursor-pointer mt-4"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        style={{ color: "var(--primary)" }}
      >
        {mode === "login"
          ? "Don't have an account? Sign up"
          : "Already have an account? Login"}
      </div>

      {msg && (
        <p className="text-xs mt-3" style={{ color: "var(--primary)" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
