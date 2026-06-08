import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FolderKanban,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";

function ClientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Get logged-in user email
    const userEmail = localStorage.getItem("userEmail") || 
                     localStorage.getItem("email") ||
                     sessionStorage.getItem("userEmail");
    
    // Also try to get from user object
    let userEmailFromObj = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userEmailFromObj = user.email;
      } catch (e) {}
    }
    
    const finalEmail = userEmailFromObj || userEmail || "shubham@example.com";
    
    console.log("Fetching dashboard for logged-in user:", finalEmail);
    
    fetch(`http://localhost:5000/api/dashboard/client/${encodeURIComponent(finalEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Dashboard data received:", data);
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleNewEstimate = () => navigate("/estimations");
  const handleDownloadReport = () => alert("Report will be generated from your actual estimation data");

  if (loading) {
    return (
      <ClientHubLayout activeItem="Dashboard">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading your dashboard data from database...</p>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  if (error) {
    return (
      <ClientHubLayout activeItem="Dashboard">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-xl mb-4">⚠️ Unable to Load Data</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 text-white rounded-xl">
              Retry
            </button>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  // METRICS - Using REAL data from backend
  const metrics = [
    {
      label: "Active estimates",
      value: dashboardData?.metrics?.activeEstimates || 0,
      detail: "Total estimates created",
      icon: FileText,
    },
    {
      label: "Approved projects",
      value: dashboardData?.metrics?.approvedProjects || 0,
      detail: "Awaiting implementation",
      icon: CheckCircle2,
    },
    {
      label: "Average timeline",
      value: dashboardData?.metrics?.averageTimeline || "0 days",
      detail: "Per project estimate",
      icon: CalendarDays,
    },
    {
      label: "Estimated budget",
      value: dashboardData?.metrics?.estimatedBudget || "₹0",
      detail: "Total across all estimates",
      icon: IndianRupee,
    },
  ];

  return (
    <ClientHubLayout activeItem="Dashboard">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {/* Metrics Cards - REAL DATA */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
                      <Icon size={20} />
                    </div>
                    <TrendingUp className="text-emerald-500" size={18} />
                  </div>
                  <p className="mt-5 text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{metric.value}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{metric.detail}</p>
                </div>
              );
            })}
          </div>

          {/* Active Work Section - REAL DATA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">Active work</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A quick view of estimates and projects that need attention.
                </p>
              </div>
              <button
                onClick={handleNewEstimate}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                New Estimate
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {dashboardData?.activeProjects?.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                  <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-medium">No estimates yet</p>
                  <p className="text-sm mt-1">Click "New Estimate" to create your first project estimate</p>
                </div>
              ) : (
                dashboardData.activeProjects.map((project, index) => (
                  <div key={index} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-base font-black text-slate-950">{project.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{project.type} · {project.stage}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        <Clock3 size={16} />
                        {project.due}
                      </div>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-slate-900" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Next Actions - REAL DATA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Next actions</h2>
            <div className="mt-5 space-y-3">
              {dashboardData?.nextActions?.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FolderKanban size={40} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No pending actions</p>
                </div>
              ) : (
                dashboardData.nextActions.map((item, index) => (
                  <div key={index} className="flex gap-3 rounded-3xl bg-slate-50 p-4">
                    <FolderKanban className="mt-0.5 shrink-0 text-slate-900" size={18} />
                    <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity - REAL DATA */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Recent activity</h2>
            <div className="mt-5 space-y-4">
              {dashboardData?.activity?.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs mt-1">Create an estimate to see activity here</p>
                </div>
              ) : (
                dashboardData.activity.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.time}</p>
                    <p className="mt-2 text-sm text-slate-800">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={handleDownloadReport}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <Download size={17} />
            Download latest report
          </button>
        </div>
      </section>
    </ClientHubLayout>
  );
}

export default ClientDashboard;