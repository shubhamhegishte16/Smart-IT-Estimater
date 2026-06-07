import { useNavigate } from "react-router-dom";
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

const metrics = [
  { label: "Active estimates", value: "6", detail: "2 awaiting review", icon: FileText },
  { label: "Approved projects", value: "12", detail: "4 completed this quarter", icon: CheckCircle2 },
  { label: "Average timeline", value: "9 wks", detail: "Across saved estimates", icon: CalendarDays },
  { label: "Estimated budget", value: "Rs 12.4L", detail: "Total planned spend", icon: IndianRupee },
];

const activeProjects = [
  {
    name: "Beacon AI Portal",
    type: "Custom Platform",
    stage: "Scope review",
    progress: 68,
    due: "Jun 14, 2026",
  },
  {
    name: "Mobile Booking App",
    type: "Mobile Application",
    stage: "Approved",
    progress: 92,
    due: "Jun 20, 2026",
  },
  {
    name: "Enterprise CRM",
    type: "SaaS Dashboard",
    stage: "Pending inputs",
    progress: 42,
    due: "Jun 26, 2026",
  },
];

const nextActions = [
  "Review selected features for Beacon AI Portal",
  "Confirm budget range for Enterprise CRM",
  "Download approved estimate for Mobile Booking App",
];

const activity = [
  { time: "Today, 09:12 AM", text: "Created a new estimate for Beacon AI Portal." },
  { time: "Yesterday, 04:30 PM", text: "Downloaded the Mobile Booking App summary." },
  { time: "Jun 3, 2026", text: "Updated company profile and contact details." },
];

function ClientDashboard() {
  const navigate = useNavigate();

  return (
    <ClientHubLayout activeItem="Dashboard">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
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

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight">Active work</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A quick view of estimates and projects that need attention.
                </p>
              </div>
              <button
                onClick={() => navigate("/estimations")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                New Estimate
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {activeProjects.map((project) => (
                <div key={project.name} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
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
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Next actions</h2>
            <div className="mt-5 space-y-3">
              {nextActions.map((item) => (
                <div key={item} className="flex gap-3 rounded-3xl bg-slate-50 p-4">
                  <FolderKanban className="mt-0.5 shrink-0 text-slate-900" size={18} />
                  <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Recent activity</h2>
            <div className="mt-5 space-y-4">
              {activity.map((item) => (
                <div key={item.time} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.time}</p>
                  <p className="mt-2 text-sm text-slate-800">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
            <Download size={17} />
            Download latest report
          </button>
        </div>
      </section>
    </ClientHubLayout>
  );
}

export default ClientDashboard;
