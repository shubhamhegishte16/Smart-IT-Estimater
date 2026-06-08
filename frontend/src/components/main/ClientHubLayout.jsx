import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const sidebarItems = [
  { label: "Dashboard", path: "/client/dashboard" },
  { label: "New Estimate", path: "/estimations" },
  { label: "My Estimates", path: "/client/estimations" },
  { label: "Downloads", path: "/client/downloads" },
  { label: "Profile", path: "/client/profile" },
  { label: "Settings", path: "/client/settings" },
  { label: "Logout", action: "logout" },
];

function ClientHubLayout({
  activeItem = "Dashboard",
  children,
  showProfileActions = false,
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    // Also check for individual fields
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!userStr && (userName || userEmail)) {
      setUser({
        name: userName,
        email: userEmail,
        company: localStorage.getItem("userCompany") || "Client",
        phone: localStorage.getItem("userPhone") || "",
      });
    }
    
    setLoading(false);
  }, []);

  const handleSidebarClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCompany");
      navigate("/");
      return;
    }

    if (!item.path) {
      return;
    }

    navigate(item.path);
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "C";
  };

  // Format date joined
  const getMemberSince = () => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return "Recently";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="sticky top-6 h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Navigation
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-tight">
                  Client Hub
                </h2>
              </div>
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <div key={item.label} className="w-full rounded-2xl px-4 py-3 text-sm font-medium bg-gray-100 animate-pulse">
                    {item.label}
                  </div>
                ))}
              </div>
            </aside>
            <main className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="animate-pulse">Loading profile...</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="sticky top-6 h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Navigation
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-tight">
                Client Hub
              </h2>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    item.label === activeItem
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">
            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-5">
                  <div className="grid h-28 w-28 place-items-center rounded-[28px] bg-slate-900 text-4xl font-black text-white">
                    {getUserInitial()}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                      Client workspace
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                      {user?.name || "Client"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                      {user?.company || "Company not set"}
                    </p>
                  </div>
                </div>

                {showProfileActions && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => navigate("/client/profile")}
                      className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Edit Profile
                    </button>
                    <button className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                      Change Password
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryTile label="Email" value={user?.email || "Not set"} />
                <SummaryTile label="Phone" value={user?.phone || "Not set"} />
                <SummaryTile label="Member since" value={getMemberSince()} />
                <SummaryTile label="Preferred currency" value="USD" />
              </div>
            </section>

            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default ClientHubLayout;