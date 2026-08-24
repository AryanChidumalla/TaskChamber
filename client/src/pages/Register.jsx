import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { CheckCircle, ArrowRight, LockKey, Envelope, User, Sparkle } from "@phosphor-icons/react";
import ThemeSelector from "../components/ThemeSelector";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const { currentAccent } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex selection:bg-blue-500/20 relative">
      {/* Floating Theme Switcher */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeSelector />
      </div>

      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Left Side: Brand Showcase */}
        <div className="hidden lg:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950 p-12 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div
            className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentAccent.hex }}
          />

          {/* Logo */}
          <div className="flex items-center gap-2.5 z-10">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg text-sm"
              style={{ backgroundColor: currentAccent.hex }}
            >
              TC
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">TaskChamber</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Minimalist Project & Task Management</p>
            </div>
          </div>

          {/* Hero Pitch */}
          <div className="max-w-md z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkle size={14} weight="fill" className={currentAccent.text} />
              Build without friction
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Start organizing
              <br />
              <span className={currentAccent.text}>your projects today.</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Create an account in seconds to manage tasks, collaborate on project workflows, and maintain total clarity across your projects.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle size={17} weight="fill" className="text-emerald-500 shrink-0" />
                <span>Unlimited workspaces, columns, and task cards</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle size={17} weight="fill" className="text-emerald-500 shrink-0" />
                <span>Real-time column filtering and priority tags</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle size={17} weight="fill" className="text-emerald-500 shrink-0" />
                <span>Zero bloated menus or distracting noise</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-xs text-slate-400 dark:text-slate-600 z-10">
            © {new Date().getFullYear()} TaskChamber.
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-sm space-y-5">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-sm"
                style={{ backgroundColor: currentAccent.hex }}
              >
                TC
              </div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">TaskChamber</h1>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create an account
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter your details to create your personal workspace.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-300 text-xs animate-fade-in font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} weight="bold" className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    autoComplete="name"
                    required
                    className={`w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition ${currentAccent.ring}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Envelope size={16} weight="bold" className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    autoComplete="email"
                    required
                    className={`w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition ${currentAccent.ring}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <LockKey size={16} weight="bold" className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                    className={`w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition ${currentAccent.ring}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockKey size={16} weight="bold" className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                    className={`w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition ${currentAccent.ring}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-semibold shadow-md transition disabled:opacity-50 mt-2 ${currentAccent.tailwind}`}
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Get Started <ArrowRight size={14} weight="bold" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-semibold ${currentAccent.text} hover:underline transition`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
