import { useMemo, useState, useEffect } from "react";
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
  ArrowDownRight,
  ShieldCheck,
  Upload,
} from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";

const sidebarItems = [
  { label: "Dashboard", path: "/client/dashboard" },
  { label: "New Estimate", path: "/estimations" },
  { label: "My Estimates", path: "/client/estimations" },
  { label: "Downloads", path: "/client/downloads", active: true },
  { label: "Profile", path: "/client/profile" },
  { label: "Settings", path: "/client/settings" },
  { label: "Logout", action: "logout" },
];

const statusStyles = {
  Ready: "bg-emerald-100 text-emerald-700",
  Downloaded: "bg-sky-100 text-sky-700",
  Shared: "bg-amber-100 text-amber-700",
  Generated: "bg-purple-100 text-purple-700",
};

const fileTypeColors = {
  PDF: "bg-red-100 text-red-700",
  DOCX: "bg-blue-100 text-blue-700",
  XLSX: "bg-emerald-100 text-emerald-700",
  CSV: "bg-orange-100 text-orange-700",
};

const exportButtons = [
  { label: "Export as PDF", format: "pdf", color: "bg-slate-900 text-white", icon: FileText },
  { label: "Export as Excel", format: "xlsx", color: "bg-emerald-50 text-emerald-700", icon: BarChart3 },
  { label: "Export as Word", format: "docx", color: "bg-sky-50 text-sky-700", icon: FileSignature },
  { label: "Export All Documents", format: "all", color: "bg-blue-900 text-white", icon: ArrowDownRight },
];

const quickActions = [
  { label: "Generate New Report", action: "report", icon: FilePlus },
  { label: "Download Latest Quotation", action: "quotation", icon: Download },
  { label: "Export Current Estimate", action: "export", icon: Upload },
  { label: "Contact Admin", action: "contact", icon: Share2 },
];

export default function Downloads() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    quotationsDownloaded: 0,
    reportsGenerated: 0,
    lastDownload: "N/A"
  });
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 120, percentage: 0 });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchDownloadsData();
  }, []);

  const fetchDownloadsData = async () => {
    try {
      // Get logged-in user's email
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
      
      console.log("Fetching downloads for:", userEmail);
      
      // Fetch estimates to generate download data
      const response = await fetch(`http://localhost:5000/api/estimations/client/${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const estimations = data.estimations || data;
      
      console.log("Estimations for downloads:", estimations);
      
      // Generate download records from estimations
      const generatedDownloads = generateDownloadsFromEstimations(estimations);
      setDownloads(generatedDownloads);
      
      // Calculate stats
      calculateStats(generatedDownloads);
      
      // Set recent downloads
      setRecentDownloads(generatedDownloads.slice(0, 3));
      
      // Generate activity timeline
      const activity = generateActivityTimeline(estimations);
      setActivityTimeline(activity);
      
      // Calculate category counts
      const categories = calculateCategoryCounts(generatedDownloads);
      setCategoryCounts(categories);
      
      // Calculate storage usage
      const storage = calculateStorageUsage(generatedDownloads);
      setStorageInfo(storage);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching downloads:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const generateDownloadsFromEstimations = (estimations) => {
    const downloads = [];
    
    estimations.forEach((est, index) => {
      // Generate PDF estimate
      downloads.push({
        id: `${est._id}_pdf`,
        name: `Estimate Report - ${est.clientName || "Project"}`,
        project: est.clientName || "Project",
        fileType: "PDF",
        category: "Reports",
        generated: formatDate(est.createdAt),
        size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
        status: index % 3 === 0 ? "Ready" : index % 3 === 1 ? "Downloaded" : "Generated",
        downloadUrl: `/api/downloads/estimate/${est._id}/pdf`,
        originalData: est
      });
      
      // Generate quotation for some
      if (index % 2 === 0) {
        downloads.push({
          id: `${est._id}_docx`,
          name: `Quotation - ${est.clientName || "Project"}`,
          project: est.clientName || "Project",
          fileType: "DOCX",
          category: "Quotations",
          generated: formatDate(est.createdAt),
          size: `${Math.floor(Math.random() * 2) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
          status: index % 2 === 0 ? "Ready" : "Downloaded",
          downloadUrl: `/api/downloads/estimate/${est._id}/docx`,
          originalData: est
        });
      }
      
      // Generate cost breakdown for some
      if (index % 3 === 0) {
        downloads.push({
          id: `${est._id}_xlsx`,
          name: `Cost Breakdown - ${est.clientName || "Project"}`,
          project: est.clientName || "Project",
          fileType: "XLSX",
          category: "Cost Estimates",
          generated: formatDate(est.createdAt),
          size: `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
          status: "Ready",
          downloadUrl: `/api/downloads/estimate/${est._id}/xlsx`,
          originalData: est
        });
      }
    });
    
    return downloads.sort((a, b) => new Date(b.generated) - new Date(a.generated));
  };

  const calculateStats = (downloads) => {
    const totalDownloads = downloads.length;
    const quotationsDownloaded = downloads.filter(d => d.category === "Quotations").length;
    const reportsGenerated = downloads.filter(d => d.category === "Reports").length;
    
    const lastDownloadDate = downloads.length > 0 ? downloads[0].generated : "N/A";
    
    setStats({
      totalDownloads,
      quotationsDownloaded,
      reportsGenerated,
      lastDownload: lastDownloadDate
    });
  };

  const generateActivityTimeline = (estimations) => {
    return estimations.slice(0, 4).map(est => ({
      event: est.status === "approved" ? "Estimate Approved" : "Estimate Generated",
      detail: `${est.clientName || "Project"} - ${est.complexity || "Standard"} complexity`,
      time: getTimeAgo(est.createdAt),
      type: est.status === "approved" ? "success" : "info"
    }));
  };

  const calculateCategoryCounts = (downloads) => {
    const categories = {};
    downloads.forEach(d => {
      categories[d.category] = (categories[d.category] || 0) + 1;
    });
    return categories;
  };

  const calculateStorageUsage = (downloads) => {
    let totalSizeMB = 0;
    downloads.forEach(d => {
      const sizeMatch = d.size.match(/(\d+\.?\d*)/);
      if (sizeMatch) {
        totalSizeMB += parseFloat(sizeMatch[0]);
      }
    });
    
    const usedGB = Math.round(totalSizeMB / 1024);
    const totalGB = 120;
    const percentage = Math.min(100, Math.round((usedGB / totalGB) * 100));
    
    return { used: usedGB, total: totalGB, percentage };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
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
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  const handleDownload = async (item) => {
    try {
      console.log(`Downloading: ${item.name}`);
      alert(`Downloading "${item.name}"\n\nThis will be implemented with actual file generation.`);
      // TODO: Implement actual file download
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleView = (item) => {
    navigate(`/client/estimate/${item.originalData?._id || item.id}`);
  };

  const handleShare = async (item) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/client/estimate/${item.originalData?._id || item.id}`);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleDelete = async (item) => {
    if (confirm(`Delete "${item.name}"? This action cannot be undone.`)) {
      setDownloads(downloads.filter(d => d.id !== item.id));
      alert("Document removed from list");
    }
  };

  const handleExport = async (format) => {
    alert(`Exporting all documents as ${format.toUpperCase()}\n\nThis will be implemented with actual export functionality.`);
  };

  const handleQuickAction = async (action) => {
    switch(action) {
      case "report":
        navigate("/estimations");
        break;
      case "quotation":
        const latestEstimate = downloads[0];
        if (latestEstimate) handleDownload(latestEstimate);
        else alert("No estimates available");
        break;
      case "export":
        handleExport("pdf");
        break;
      case "contact":
        window.location.href = "mailto:support@example.com";
        break;
      default:
        break;
    }
  };

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchesSearch = [item.name, item.project, item.category, item.fileType]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, downloads]);

  const categoriesList = [
    { title: "Quotations", icon: FileText, count: categoryCounts["Quotations"] || 0 },
    { title: "Cost Estimates", icon: BarChart3, count: categoryCounts["Cost Estimates"] || 0 },
    { title: "Reports", icon: FileText, count: categoryCounts["Reports"] || 0 },
    { title: "Invoices", icon: FileSignature, count: categoryCounts["Invoices"] || 0 },
    { title: "Contracts", icon: ShieldCheck, count: categoryCounts["Contracts"] || 0 },
    { title: "Project Documents", icon: FolderOpen, count: categoryCounts["Project Documents"] || 0 },
  ];

  if (loading) {
    return (
      <ClientHubLayout activeItem="Downloads">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading your documents from database...</p>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  if (error) {
    return (
      <ClientHubLayout activeItem="Downloads">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl mb-4">⚠️ Unable to Load Documents</div>
            <p className="text-slate-600 mb-4">{error}</p>
            <button 
              onClick={fetchDownloadsData}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
            >
              Retry
            </button>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  const statsCards = [
    { label: "Total Downloads", value: stats.totalDownloads, icon: FileText },
    { label: "Quotations Downloaded", value: stats.quotationsDownloaded, icon: FileText },
    { label: "Reports Generated", value: stats.reportsGenerated, icon: BarChart3 },
    { label: "Last Download", value: stats.lastDownload, icon: Clock3 },
  ];

  return (
    <ClientHubLayout activeItem="Downloads">
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
                  onClick={() => handleExport(button.format)}
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
          {statsCards.map((item) => (
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
                      <tr key={item.id} className="border-t border-slate-200 transition hover:bg-slate-50">
                        <td className="px-5 py-4 font-medium text-slate-900">{item.name}</td>
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
                            <button onClick={() => handleView(item)} className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button onClick={() => handleDownload(item)} className="inline-flex h-9 items-center gap-2 rounded-2xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800">
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                            <button onClick={() => handleShare(item)} className="inline-flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                              <Share2 className="h-4 w-4" />
                              Share
                            </button>
                            <button onClick={() => handleDelete(item)} className="inline-flex h-9 items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">
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
                    onClick={() => handleExport(item.format)}
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
                  <p className="mt-1 text-sm text-slate-500">{storageInfo.used} GB used of {storageInfo.total} GB</p>
                </div>
                <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {storageInfo.percentage}% used
                </div>
              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-slate-900 to-slate-500" style={{ width: `${storageInfo.percentage}%` }} />
              </div>

              <div className="mt-6 grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Documents</span>
                  <span>{downloads.length} files</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Remaining storage</span>
                  <span>{storageInfo.total - storageInfo.used} GB</span>
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
                  <div key={file.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <button onClick={() => handleDownload(file)} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-800">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                    <div className="mt-5">
                      <p className="text-base font-semibold text-slate-950">{file.name}</p>
                      <p className="mt-2 text-sm text-slate-500">{file.project}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>{file.size}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{file.fileType}</span>
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
                {categoriesList.map((category) => (
                  <div key={category.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-900 text-white">
                        <category.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{category.title}</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">{category.count} files</p>
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
                {activityTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
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
                    onClick={() => handleQuickAction(action.action)}
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
    </ClientHubLayout>
  );
}