import React, { useState } from "react";

const Login = ({ onLogin, loading }) => {
  const [identifier, setIdentifier] = useState("EMP1001");
  const [password, setPassword] = useState("Emp@12345");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await onLogin({ identifier, password });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Employee Code or Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
      </form>
    </div>
  );
};

export default Login;
