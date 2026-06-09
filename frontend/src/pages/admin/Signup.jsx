import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/authService";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    phone: "",
    role: "client"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!form.company) {
      setError("Company name is required.");
      setLoading(false);
      return;
    }

    if (!form.phone) {
      setError("Phone number is required.");
      setLoading(false);
      return;
    }

    try {
      // Register with company and phone
      await registerUser(
        form.name,
        form.email,
        form.password,
        form.role,
        form.company,
        form.phone
      );

      // Auto login after registration
      const data = await loginUser(form.email, form.password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userCompany", data.user.company);
      localStorage.setItem("userPhone", data.user.phone);

      navigate("/client/dashboard");

    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0A0A0A]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <Link to="/" className="mb-10 inline-flex items-center gap-3 text-lg font-black tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0A0A0A] text-white">B</span>
              Beacon
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-black/35">
                Start estimating
              </p>
              <h2 className="text-4xl font-black tracking-tight">Create account</h2>
              <p className="mt-3 text-sm leading-6 text-black/50">
                Set up your Beacon account and begin building smarter project estimates.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Full name *</span>
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                  required
                />
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Email address *</span>
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

              {/* Company Name */}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Company name *</span>
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={updateField}
                  placeholder="Your company name"
                  required
                />
              </label>

              {/* Phone Number */}
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-black/70">Phone number *</span>
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="+91 98765 43210"
                  required
                />
              </label>

              {/* Password Fields */}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-black/70">Password *</span>
                  <input
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={updateField}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-black/70">Confirm password *</span>
                  <input
                    className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-[#0A0A0A] outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-4 focus:ring-black/10"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={updateField}
                    placeholder="Repeat password"
                    required
                  />
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                className="h-12 w-full rounded-xl bg-[#0A0A0A] text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-black/50">
              Already have an account?{" "}
              <Link className="font-bold text-black hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden border-l border-black/10 bg-white p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="text-right text-sm font-semibold uppercase tracking-[0.24em] text-black/35">
            Beacon admin
          </div>

          <div className="ml-auto max-w-xl text-right">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-black/40">
              Built for clarity
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight xl:text-6xl">
              Turn rough ideas into confident software budgets.
            </h1>
            <p className="ml-auto mt-6 max-w-lg text-lg leading-8 text-black/60">
              Configure features, project types, and pricing rules with a workspace that stays clean and direct.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["01", "Add project details"],
              ["02", "Choose features"],
              ["03", "Generate estimate"],
            ].map(([step, text]) => (
              <div key={step} className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
                <p className="text-2xl font-black">{step}</p>
                <p className="mt-1 text-sm text-black/45">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signup;