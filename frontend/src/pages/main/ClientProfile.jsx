import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", path: "/client/dashboard" },
  { label: "New Estimate", path: "/estimations" },
  { label: "My Estimates", path: "/client/estimations" },
  { label: "Downloads", path: "/client/downloads" },
  { label: "Profile", path: "/client/profile" },
  { label: "Settings", path: "/client/settings" },
  { label: "Logout", action: "logout" },
];

export default function ClientProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    memberSince: "",
    address: "",
    industry: "",
    website: "",
    accountType: "Business",
    preferredCurrency: "USD",
    notificationPreferences: "Email"
  });
  const [stats, setStats] = useState({
    totalEstimates: 0,
    approvedQuotes: 0,
    pendingQuotes: 0,
    savedProjects: 0,
    estimatedBudget: "$0"
  });
  const [recentEstimations, setRecentEstimations] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserEstimations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // Get logged-in user from localStorage
      const userStr = localStorage.getItem("user");
      let userEmail = null;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userEmail = user.email;
        } catch (e) {}
      }
      
      if (!userEmail) {
        userEmail = localStorage.getItem("userEmail") || "shubham@example.com";
      }
      
      console.log("Fetching profile for:", userEmail);
      
      const response = await fetch(`http://localhost:5000/api/users/profile/${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const user = data.user || data;
      
      setProfile({
        name: user.name || "",
        company: user.company || "",
        email: user.email || "",
        phone: user.phone || "",
        memberSince: formatMemberSince(user.createdAt),
        address: user.address || "Not set",
        industry: user.industry || "Technology",
        website: user.website || "",
        accountType: user.accountType || "Business",
        preferredCurrency: user.preferredCurrency || "USD",
        notificationPreferences: user.notificationPreferences || "Email"
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
    }
  };

  const fetchUserEstimations = async () => {
    try {
      const userStr = localStorage.getItem("user");
      let userEmail = null;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userEmail = user.email;
        } catch (e) {}
      }
      
      if (!userEmail) {
        userEmail = localStorage.getItem("userEmail") || "shubham@example.com";
      }
      
      const response = await fetch(`http://localhost:5000/api/estimations/client/${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const estimations = data.estimations || data;
      
      // Calculate stats
      const totalEstimates = estimations.length;
      const approvedQuotes = estimations.filter(e => e.status === "approved").length;
      const pendingQuotes = estimations.filter(e => e.status === "pending" || e.status === "draft").length;
      const totalBudget = estimations.reduce((sum, e) => sum + (e.totalCost || 0), 0);
      
      setStats({
        totalEstimates,
        approvedQuotes,
        pendingQuotes,
        savedProjects: estimations.filter(e => e.status === "draft").length,
        estimatedBudget: `₹${totalBudget.toLocaleString('en-IN')}`
      });
      
      // Recent estimations
      const recent = estimations.slice(0, 3).map(est => ({
        name: est.clientName || "Project",
        type: est.projectType?.name || "General",
        cost: `₹${(est.totalCost || 0).toLocaleString('en-IN')}`,
        timeline: `${est.totalDays || 0} weeks`,
        complexity: est.complexity || "Medium",
        status: est.status || "draft",
        id: est._id
      }));
      setRecentEstimations(recent);
      
      // Saved projects (draft estimates)
      const saved = estimations.filter(e => e.status === "draft").slice(0, 3).map(est => ({
        title: est.clientName || "Project",
        features: est.features?.length || 0,
        budget: `₹${(est.totalCost || 0).toLocaleString('en-IN')}`,
        modified: getTimeAgo(est.updatedAt),
        id: est._id
      }));
      setSavedProjects(saved);
      
      // Activity timeline
      const activities = estimations.slice(0, 4).map(est => ({
        time: formatDate(est.createdAt),
        event: `Created a new estimate for ${est.clientName || "project"}.`
      }));
      setActivityTimeline(activities);
      
      // Notifications (based on estimate statuses)
      const notifs = [];
      if (pendingQuotes > 0) {
        notifs.push({ title: "Pending estimates", description: `You have ${pendingQuotes} estimate(s) waiting for review.` });
      }
      if (approvedQuotes > 0) {
        notifs.push({ title: "Quotes approved", description: `${approvedQuotes} of your proposals have been approved.` });
      }
      notifs.push({ title: "System announcement", description: "New features available for your next estimate." });
      setNotifications(notifs);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching estimations:", error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${encodeURIComponent(profile.email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          company: profile.company,
          phone: profile.phone,
          address: profile.address,
          industry: profile.industry,
          website: profile.website,
          preferredCurrency: profile.preferredCurrency,
          notificationPreferences: profile.notificationPreferences
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = profile.name;
        user.company = profile.company;
        user.phone = profile.phone;
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      alert("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) return "Today";
    if (date >= yesterday) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleSidebarClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      navigate("/");
      return;
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const goToEstimator = () => {
    navigate("/estimations");
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "approved": return "text-green-600 bg-green-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "in review": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading profile...</p>
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
                  <div className="grid h-28 w-28 place-items-center rounded-[28px] bg-slate-900 text-4xl font-black text-white">
                    {profile.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Client profile</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{profile.name}</h1>
                    <p className="mt-1 text-sm text-slate-600">{profile.company}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setEditing(!editing)}
                    className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {editing ? "Cancel" : "Edit Profile"}
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
                  <p className="mt-2 text-base font-semibold text-slate-900">{profile.phone || "Not set"}</p>
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

            {editing && (
              <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Edit Profile</h2>
                <form onSubmit={handleUpdateProfile} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Address</label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Industry</label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => setProfile({...profile, industry: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Website</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Preferred Currency</label>
                    <select
                      value={profile.preferredCurrency}
                      onChange={(e) => setProfile({...profile, preferredCurrency: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-tight">Profile statistics</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total Estimates</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{stats.totalEstimates}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Approved Quotes</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{stats.approvedQuotes}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Pending Quotes</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{stats.pendingQuotes}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Saved Projects</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{stats.savedProjects}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Estimated Budget</p>
                    <p className="mt-3 text-2xl font-black text-slate-950">{stats.estimatedBudget}</p>
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
                <button onClick={goToEstimator} className="h-11 w-full max-w-[180px] rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Create estimate
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {["Project Name", "Project Type", "Estimated Cost", "Timeline", "Complexity", "Status", ""].map((label) => (
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
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button 
                            onClick={() => navigate(`/client/estimate/${item.id}`)}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {recentEstimations.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-slate-500">
                          No estimates yet. Create your first estimate!
                        </td>
                      </tr>
                    )}
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
                  <button onClick={goToEstimator} className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white">
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
                          onClick={() => navigate(`/client/estimate/${project.id}`)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-white"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                  {savedProjects.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-slate-500">
                      No saved projects. Create and save an estimate!
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Activity timeline</h2>
                  <div className="mt-5 space-y-4">
                    {activityTimeline.map((item, idx) => (
                      <div key={idx} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.time}</p>
                        <p className="mt-2 text-sm text-slate-900">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight">Notifications</h2>
                  <div className="mt-5 space-y-4">
                    {notifications.map((item, idx) => (
                      <div key={idx} className="rounded-3xl bg-slate-50 p-4">
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