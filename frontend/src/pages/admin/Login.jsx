import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);
      if (data?.token) localStorage.setItem("token", data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Sign in failed. Please check your email, password, or backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0A0A0A]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-black/10 bg-white p-12 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="inline-flex items-center gap-3 text-xl font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0A0A0A] text-white">B</span>
            Beacon
          </Link>

          <div className="max-w-xl">
            <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Estimate better. Start faster.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-black/60">
              Sign in to manage project types, pricing, features, and client estimates from one focused admin workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Fast", "project setup"],
              ["Clear", "cost planning"],
              ["Smart", "admin control"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="text-2xl font-black">{title}</p>
                <p className="mt-1 text-sm text-black/45">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center gap-3 text-lg font-black tracking-tight lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0A0A0A] text-white">B</span>
              Beacon
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-black/35">
                Welcome back
              </p>
              <h2 className="text-4xl font-black tracking-tight">Login</h2>
              <p className="mt-3 text-sm leading-6 text-black/50">
                Enter your account details to continue to the Beacon dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Email address</span>
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@company.com"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Password</span>
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Enter password"
                  required
                />
              </label>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="flex items-center gap-2 text-black/55">
                  <input
                    className="h-4 w-4 rounded border-black/20 accent-black"
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={updateField}
                  />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-black/75 hover:text-black">
                  Forgot password?
                </button>
              </div>

              {error && (
                <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <button
                className="h-12 w-full rounded-xl bg-[#0A0A0A] text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-black/50">
              New to Beacon?{" "}
              <Link className="font-bold text-black hover:underline" to="/admin/signup">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;


