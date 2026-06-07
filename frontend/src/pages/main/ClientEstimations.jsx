import { useNavigate } from "react-router-dom";
import { ArrowRight, Download, Eye, Search } from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";

const estimates = [
  {
    id: "EST-1042",
    project: "Beacon AI Portal",
    type: "Custom Platform",
    amount: "Rs 8,40,000",
    timeline: "12 weeks",
    complexity: "Medium",
    status: "In Review",
    created: "Jun 6, 2026",
  },
  {
    id: "EST-1038",
    project: "Mobile Booking App",
    type: "Mobile Application",
    amount: "Rs 5,90,000",
    timeline: "8 weeks",
    complexity: "Low",
    status: "Approved",
    created: "Jun 2, 2026",
  },
  {
    id: "EST-1031",
    project: "Enterprise CRM",
    type: "SaaS Dashboard",
    amount: "Rs 11,25,000",
    timeline: "16 weeks",
    complexity: "High",
    status: "Pending",
    created: "May 29, 2026",
  },
  {
    id: "EST-1024",
    project: "E-commerce Launch",
    type: "E-Commerce",
    amount: "Rs 4,10,000",
    timeline: "7 weeks",
    complexity: "Medium",
    status: "Draft",
    created: "May 24, 2026",
  },
];

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "In Review": "bg-blue-50 text-blue-700 ring-blue-200",
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Draft: "bg-slate-100 text-slate-700 ring-slate-200",
};

function ClientEstimations() {
  const navigate = useNavigate();

  return (
    <ClientHubLayout activeItem="My Estimates">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Estimate history
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
              My Estimates
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review estimates you created, track status, and continue planning.
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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 sm:max-w-sm">
            <Search size={17} className="text-slate-500" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              placeholder="Search estimates"
              type="search"
            />
          </label>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600 sm:w-auto">
            <span className="rounded-xl bg-slate-50 px-4 py-3">All 4</span>
            <span className="rounded-xl bg-slate-50 px-4 py-3">Open 2</span>
            <span className="rounded-xl bg-slate-50 px-4 py-3">Closed 1</span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {[
                  "Estimate",
                  "Project",
                  "Type",
                  "Amount",
                  "Timeline",
                  "Complexity",
                  "Status",
                  "Created",
                  "",
                ].map((label) => (
                  <th key={label} className="px-4 py-4 font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-4 font-black text-slate-950">{estimate.id}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{estimate.project}</td>
                  <td className="px-4 py-4 text-slate-600">{estimate.type}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{estimate.amount}</td>
                  <td className="px-4 py-4 text-slate-600">{estimate.timeline}</td>
                  <td className="px-4 py-4 text-slate-600">{estimate.complexity}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[estimate.status]}`}>
                      {estimate.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{estimate.created}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100">
                        <Eye size={16} />
                      </button>
                      <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ClientHubLayout>
  );
}

export default ClientEstimations;
