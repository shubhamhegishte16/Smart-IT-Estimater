import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  Share2,
  Trash2,
  FileText,
  BarChart3,
 FileSignature,
  FilePlus,
  Clock3,
  FolderOpen,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Upload,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", path: "/client/dashboard" },
  { label: "New Estimate", path: "/estimations" },
  { label: "My Estimates", path: "/client/estimations" },
  { label: "Downloads", path: "/client/downloads", active: true },
  { label: "Profile", path: "/client/profile" },
  { label: "Settings", path: "/client/settings" },
  { label: "Logout", action: "logout" },
];

const stats = [
  { label: "Total Downloads", value: "1,248", icon: FileText },
  { label: "Quotations Downloaded", value: "382", icon: FileText, },
  { label: "Reports Generated", value: "94", icon: BarChart3 },
  { label: "Last Download", value: "Jun 5, 2026", icon: Clock3 },
];

const allDownloads = [
  {
    name: "Project Estimate Report",
    project: "Beacon AI Portal",
    fileType: "PDF",
    category: "Reports",
    generated: "Jun 5, 2026",
    size: "2.1 MB",
    status: "Ready",
  },
  {
    name: "Final Quotation",
    project: "Mobile Booking App",
    fileType: "DOCX",
    category: "Quotations",
    generated: "Jun 3, 2026",
    size: "1.2 MB",
    status: "Downloaded",
  },
  {
    name: "Cost Breakdown Report",
    project: "Enterprise CRM",
    fileType: "XLSX",
    category: "Cost Estimates",
    generated: "Jun 2, 2026",
    size: "1.8 MB",
    status: "Ready",
  },
  {
    name: "Development Timeline",
    project: "Marketplace MVP",
    fileType: "PDF",
    category: "Project Documents",
    generated: "May 28, 2026",
    size: "820 KB",
    status: "Shared",
  },
  {
    name: "Technology Stack Recommendation",
    project: "Workflow Automation",
    fileType: "DOCX",
    category: "Reports",
    generated: "May 24, 2026",
    size: "1.4 MB",
    status: "Ready",
  },
  {
    name: "Client Proposal",
    project: "Lumenix Platform",
    fileType: "PDF",
    category: "Contracts",
    generated: "May 20, 2026",
    size: "1.0 MB",
    status: "Downloaded",
  },
];

const recentDownloads = [
  {
    label: "Final Quotation",
    date: "Jun 3, 2026",
    size: "1.2 MB",
    type: "DOCX",
  },
  {
    label: "Project Estimate Report",
    date: "Jun 5, 2026",
    size: "2.1 MB",
    type: "PDF",
  },
  {
    label: "Development Timeline",
    date: "May 28, 2026",
    size: "820 KB",
    type: "PDF",
  },
];

const categories = [
  { title: "Quotations", icon: FileText, count: "18 files" },
  { title: "Cost Estimates", icon: BarChart3, count: "12 files" },
  { title: "Reports", icon: FileText, count: "42 files" },
  { title: "Invoices", icon: FileSignature, count: "6 files" },
  { title: "Contracts", icon: ShieldCheck, count: "9 files" },
  { title: "Project Documents", icon: FolderOpen, count: "22 files" },
];

const activityTimeline = [
  { event: "Downloaded quotation", detail: "Final Quotation · Mobile Booking App", time: "Today, 09:12 AM" },
  { event: "Generated PDF report", detail: "Project Estimate Report · Beacon AI Portal", time: "Yesterday, 04:18 PM" },
  { event: "Shared document", detail: "Development Timeline · Marketplace MVP", time: "Jun 4, 2026" },
  { event: "Exported estimate", detail: "Cost Breakdown Report · Enterprise CRM", time: "May 31, 2026" },
];

const quickActions = [
  { label: "Generate New Report", icon: FilePlus },
  { label: "Download Latest Quotation", icon: Download },
  { label: "Export Current Estimate", icon: Upload },
  { label: "Contact Admin", icon: Share2 },
];

const exportButtons = [
  { label: "Export as PDF", color: "bg-slate-900 text-white", icon: FileText },
  { label: "Export as Excel", color: "bg-emerald-50 text-emerald-700", icon: BarChart3 },
  { label: "Export as Word", color: "bg-sky-50 text-sky-700", icon: FileSignature },
  { label: "Export All Documents", color: "bg-blue-900 text-white", icon: ArrowDownRight },
];

const statusStyles = {
  Ready: "bg-emerald-100 text-emerald-700",
  Downloaded: "bg-sky-100 text-sky-700",
  Shared: "bg-amber-100 text-amber-700",
};

const fileTypeColors = {
  PDF: "bg-red-100 text-red-700",
  DOCX: "bg-blue-100 text-blue-700",
  XLSX: "bg-emerald-100 text-emerald-700",
};

export default function Downloads() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleSidebarClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    navigate(item.path);
  };

  const filteredDownloads = useMemo(() => {
    return allDownloads.filter((item) => {
      const matchesSearch = [item.name, item.project, item.category, item.fileType]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const usedStorage = 62;
  const totalStorage = 120;
  const storagePercent = Math.round((usedStorage / totalStorage) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1700px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <aside className="sticky top-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Navigation
              </p>
              <h2 className="mt-4 text-2xl font-black tracking-tight">Downloads Hub</h2>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSidebarClick(item)}
                  className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    item.active
                      ? "bg-slate-900 text-white shadow-lg"
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
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Downloads center</p>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                    Access your latest estimate and project documents
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Access and download all your generated project estimates, quotations, reports, and project documents.
                    Keep every version safe, share files with stakeholders, and export documents instantly.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:gap-4">
                  {exportButtons.slice(0, 3).map((button) => (
                    <button
                      key={button.label}
                      type="button"
                      className={`${button.color} inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition hover:opacity-95`}
                    >
                      <button.icon className="h-4 w-4" />
                      {button.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-black text-slate-950">{item.value}</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
              <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-950">Document library</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Search and manage all downloadable documents with instant actions.
                    </p>
                  </div>

                  <div className="grid w-full gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                    <label className="relative block">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </label>

                    <label className="relative block">
                      <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      >
                        <option>All</option>
                        <option>Quotations</option>
                        <option>Cost Estimates</option>
                        <option>Reports</option>
                        <option>Invoices</option>
                        <option>Contracts</option>
                        <option>Project Documents</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-medium">Document Name</th>
                        <th className="px-5 py-4 font-medium">Project Name</th>
                        <th className="px-5 py-4 font-medium">File Type</th>
                        <th className="px-5 py-4 font-medium">Category</th>
                        <th className="px-5 py-4 font-medium">Generated Date</th>
                        <th className="px-5 py-4 font-medium">Size</th>
                        <th className="px-5 py-4 font-medium">Status</th>
                        <th className="px-5 py-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDownloads.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-5 py-14 text-center text-sm text-slate-500">
                            No documents available yet. Generate your first estimate to populate this list.
                          </td>
                        </tr>
                      ) : (
                        filteredDownloads.map((item) => (
                          <tr key={`${item.name}-${item.project}`} className="border-t border-slate-200 transition hover:bg-slate-50">
                            <td className="px-5 py-4 text-slate-900">{item.name}</td>
                            <td className="px-5 py-4 text-slate-600">{item.project}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${fileTypeColors[item.fileType]}`}>
                                {item.fileType}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">{item.category}</td>
                            <td className="px-5 py-4 text-slate-600">{item.generated}</td>
                            <td className="px-5 py-4 text-slate-600">{item.size}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                                  <Eye className="h-4 w-4" />
                                  View
                                </button>
                                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-2xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800">
                                  <Download className="h-4 w-4" />
                                  Download
                                </button>
                                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </button>
                                <button type="button" className="inline-flex h-9 items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h2 className="text-xl font-black tracking-tight text-slate-950">Export center</h2>
                  <p className="mt-2 text-sm text-slate-600">Create offline copies of your documents in the format you need.</p>

                  <div className="mt-6 grid gap-3">
                    {exportButtons.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        className={`${item.color} inline-flex h-12 w-full items-center justify-between rounded-2xl px-4 text-sm font-semibold transition hover:opacity-95`}
                      >
                        <span>{item.label}</span>
                        <item.icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-slate-950">Storage usage</h3>
                      <p className="mt-1 text-sm text-slate-500">{usedStorage} GB used of {totalStorage} GB</p>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      {storagePercent}% used
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-500" style={{ width: `${storagePercent}%` }} />
                  </div>

                  <div className="mt-6 grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Documents</span>
                      <span>186 files</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Remaining storage</span>
                      <span>{totalStorage - usedStorage} GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">Recent downloads</h2>
                      <p className="mt-1 text-sm text-slate-500">Quick access to your most recent files.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {recentDownloads.map((file) => (
                      <div key={file.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                            <FileText className="h-5 w-5" />
                          </div>
                          <button type="button" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                        <div className="mt-5">
                          <p className="text-base font-semibold text-slate-950">{file.label}</p>
                          <p className="mt-2 text-sm text-slate-500">{file.date}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                          <span>{file.size}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{file.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">Category overview</h2>
                      <p className="mt-1 text-sm text-slate-500">Organize documents by file type and workflow stage.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {categories.map((category) => (
                      <div key={category.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-900 text-white">
                            <category.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">{category.title}</p>
                            <p className="mt-1 text-base font-semibold text-slate-950">{category.count}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">Download activity</h2>
                      <p className="mt-1 text-sm text-slate-500">Timeline of the latest document actions.</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {activityTimeline.map((item) => (
                      <div key={item.event} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                          <Clock3 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.event}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950">Quick actions</h2>
                      <p className="mt-1 text-sm text-slate-500">One-click workflows for your most frequent tasks.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="inline-flex h-14 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-900 text-white">
                          <action.icon className="h-4 w-4" />
                        </div>
                        {action.label}
                      </button>
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
