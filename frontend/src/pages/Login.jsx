// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { loginUser } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const redirect   = params.get("redirect") || "/dashboard";

  const [form,       setForm]       = useState({ identifier: "", password: "" });
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.identifier || !form.password)
      return setError("Please enter email/phone and password.");

    setSubmitting(true);
    try {
      const res = await loginUser({ identifier: form.identifier.trim(), password: form.password });
      login(res.data.token, res.data.user);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏦</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Sign in to your LoanEase account</p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label>Email or Phone Number</label>
            <input
              name="identifier"
              placeholder="email@example.com or 9876543210"
              value={form.identifier}
              onChange={set}
              autoFocus
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set}
            />
          </div>

          {error && <div className="auth-error">⚠ {error}</div>}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to={`/register${redirect !== "/dashboard" ? `?redirect=${redirect}` : ""}`}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}