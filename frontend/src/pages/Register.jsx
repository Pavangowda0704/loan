// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

export default function Register() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const redirect   = params.get("redirect") || "/dashboard";

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "",
  });
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name)  return setError("Name is required.");
    if (!form.email && !form.phone) return setError("Email or phone is required.");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("Invalid email format.");
    if (form.phone && !/^[0-9]{10}$/.test(form.phone))
      return setError("Phone must be exactly 10 digits.");
    if (!form.password)  return setError("Password is required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      const res = await registerUser({
        name:     form.name.trim(),
        email:    form.email.trim() || undefined,
        phone:    form.phone.trim() || undefined,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏦</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join LoanEase — apply for loans in minutes</p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label>Full Name *</label>
            <input name="name" placeholder="Rahul Sharma" value={form.name} onChange={set} autoFocus />
          </div>
          <div className="auth-field">
            <label>Email Address</label>
            <input name="email" type="email" placeholder="rahul@email.com" value={form.email} onChange={set} />
          </div>
          <div className="auth-field">
            <label>Phone Number</label>
            <input name="phone" placeholder="9876543210" value={form.phone} onChange={set} maxLength={10} />
          </div>
          <p className="auth-hint">At least one of email or phone is required.</p>
          <div className="auth-field">
            <label>Password *</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set} />
          </div>
          <div className="auth-field">
            <label>Confirm Password *</label>
            <input name="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={set} />
          </div>

          {error && <div className="auth-error">⚠ {error}</div>}

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to={`/login${redirect !== "/dashboard" ? `?redirect=${redirect}` : ""}`}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}