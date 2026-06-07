import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", path: "/client/dashboard" },
  { label: "New Estimate", path: "/estimations" },
  { label: "My Estimates", path: "/client/estimations" },
  { label: "Downloads" },
  { label: "Profile", path: "/client/profile" },
  { label: "Settings" },
  { label: "Logout", action: "logout" },
];

const profile = {
  name: "Maya Patel",
  company: "Lumenix Technologies",
  email: "maya.patel@lumenix.io",
  phone: "+1 (415) 555-0198",
  memberSince: "January 2024",
  address: "295 Mission Street, San Francisco, CA 94105",
  industry: "Fintech",
  website: "https://lumenix.io",
  accountType: "Business",
  registrationDate: "2024-01-12",
  lastLogin: "Today at 08:24 AM",
  preferredCurrency: "USD",
  notificationPreferences: "Email, SMS",
};

const stats = [
  { label: "Total Estimates", value: 24 },
  { label: "Approved Quotes", value: 12 },
  { label: "Pending Quotes", value: 5 },
  { label: "Saved Projects", value: 9 },
  { label: "Estimated Budget", value: "$148,000" },
];

const recentEstimations = [
  {
    name: "Beacon AI Portal",
    type: "Custom Platform",
    cost: "$32,400",
    timeline: "12 weeks",
    complexity: "Medium",
    status: "In Review",
  },
  {
    name: "Mobile Booking App",
    type: "Mobile App",
    cost: "$19,800",
    timeline: "8 weeks",
    complexity: "Low",
    status: "Approved",
  },
  {
    name: "Enterprise CRM",
    type: "SaaS",
    cost: "$45,000",
    timeline: "16 weeks",
    complexity: "High",
    status: "Pending",
  },
];

const savedProjects = [
  {
    title: "E-commerce Launch",
    features: 7,
    budget: "$16,250",
    modified: "2 days ago",
  },
  {
    title: "Marketplace MVP",
    features: 10,
    budget: "$24,600",
    modified: "5 days ago",
  },
  {
    title: "Workflow Automation",
    features: 5,
    budget: "$9,750",
    modified: "Last week",
  },
];

const activityTimeline = [
  { time: "Today, 09:12 AM", event: "Created a new estimate for Beacon AI Portal." },
  { time: "Yesterday, 04:30 PM", event: "Downloaded latest quotation for Mobile Booking App." },
  { time: "Jun 3, 2026", event: "Updated company profile and contact details." },
  { time: "May 29, 2026", event: "Sent a message to Beacon admin support." },
];

const notifications = [
  { title: "Quote approved", description: "Your proposal for Mobile Booking App was approved." },
  { title: "New admin message", description: "Support replied to your open request." },
  { title: "Pricing update", description: "Rates for custom integrations were updated." },
  { title: "System announcement", description: "New budgeting tools are available." },
];

export default function ClientProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      console.log(
        "ClientProfile mounted",
        "token=",
        localStorage.getItem("token"),
        "user=",
        localStorage.getItem("user")
      );
    } catch (e) {
      console.log("ClientProfile mount: error reading localStorage", e);
    }
  }, []);

  const handleSidebarClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!item.path) {
      return;
    }

    navigate(item.path);
  };

  const goToEstimator = () => {
    navigate("/estimations");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="sticky top-6 h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Navigation</p>
              <h2 className="mt-4 text-2xl font-black tracking-tight">Client Hub</h2>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    item.label === "Profile"
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
                  <div className="grid h-28 w-28 place-items-center rounded-[28px] bg-slate-900 text-4xl font-black text-white">M</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Client profile</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{profile.name}</h1>
                    <p className="mt-1 text-sm text-slate-600">{profile.company}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Edit Profile
                  </button>
                  <button className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{profile.email}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{profile.phone}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Member since</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{profile.memberSince}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Preferred currency</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{profile.preferredCurrency}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-tight">Profile statistics</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-2xl font-black text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Personal information</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Full Name", profile.name],
                      ["Company", profile.company],
                      ["Email", profile.email],
                      ["Phone", profile.phone],
                      ["Address", profile.address],
                      ["Industry", profile.industry],
                      ["Website", profile.website],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Account information</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Account Type", profile.accountType],
                      ["Registration", profile.registrationDate],
                      ["Last Login", profile.lastLogin],
                      ["Notifications", profile.notificationPreferences],
                      ["Currency", profile.preferredCurrency],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Recent estimations</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track your most recent estimations and their current approval status.
                  </p>
                </div>
                <button
                  onClick={goToEstimator}
                  className="h-11 w-full max-w-[180px] rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Create estimate
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {[
                        "Project Name",
                        "Project Type",
                        "Estimated Cost",
                        "Timeline",
                        "Complexity",
                        "Status",
                        "",
                      ].map((label) => (
                        <th key={label} className="px-4 py-4 font-semibold">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {recentEstimations.map((item) => (
                      <tr key={item.name} className="border-t border-slate-200 hover:bg-slate-50">
                        <td className="px-4 py-4 font-semibold text-slate-900">{item.name}</td>
                        <td className="px-4 py-4 text-slate-600">{item.type}</td>
                        <td className="px-4 py-4 text-slate-900">{item.cost}</td>
                        <td className="px-4 py-4 text-slate-600">{item.timeline}</td>
                        <td className="px-4 py-4 text-slate-600">{item.complexity}</td>
                        <td className="px-4 py-4 text-slate-900">{item.status}</td>
                        <td className="px-4 py-4">
                          <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Saved projects</h2>
                    <p className="mt-1 text-sm text-slate-500">Keep your best estimates ready for a fast relaunch.</p>
                  </div>
                  <button
                    onClick={goToEstimator}
                    className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    New project
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {savedProjects.map((project) => (
                    <div key={project.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{project.title}</p>
                          <p className="mt-2 text-xs text-slate-500">{project.features} features selected</p>
                        </div>
                        <p className="text-sm font-black text-slate-900">{project.budget}</p>
                      </div>
                      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                        <span>{project.modified}</span>
                        <button
                          onClick={goToEstimator}
                          className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Activity timeline</h2>
                  <div className="mt-5 space-y-4">
                    {activityTimeline.map((item) => (
                      <div key={item.time} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.time}</p>
                        <p className="mt-2 text-sm text-slate-900">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Notifications</h2>
                  <div className="mt-5 space-y-4">
                    {notifications.map((item) => (
                      <div key={item.title} className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
