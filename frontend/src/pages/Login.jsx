import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW STATES
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isAdmin", "true");
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Admin Login</h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        {/* Password with Eye Icon */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eye}
          >
            👁️
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "⏳ Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #141e30, #243b55)",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "15px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  title: {
    marginBottom: "20px",
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "12px",
    cursor: "pointer",
  },
};