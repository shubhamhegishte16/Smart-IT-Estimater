import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  FileText,
  BarChart3,
  Clock3,
  FolderOpen,
  FilePlus,
  X,
} from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Downloads() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    reportsGenerated: 0,
    lastDownload: "N/A"
  });
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchDownloadsData();
  }, []);

  const fetchDownloadsData = async () => {
    try {
      const userStr = localStorage.getItem("user");
      let userEmail = null;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userEmail = user.email;
        } catch (e) { }
      }

      if (!userEmail) {
        userEmail = localStorage.getItem("userEmail") || "shubham@example.com";
      }

      const response = await fetch(`http://localhost:5000/api/estimations/client/${encodeURIComponent(userEmail)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const estimations = data.estimations || data;

      const generatedDownloads = generateDownloadsFromEstimations(estimations);
      setDownloads(generatedDownloads);

      calculateStats(generatedDownloads);
      setRecentDownloads(generatedDownloads.slice(0, 3));

      const activity = generateActivityTimeline(estimations);
      setActivityTimeline(activity);

      const categories = calculateCategoryCounts(generatedDownloads);
      setCategoryCounts(categories);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching downloads:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const generateDownloadsFromEstimations = (estimations) => {
    const downloads = [];

    estimations.forEach((est) => {
      downloads.push({
        id: `${est._id}_pdf`,
        name: `Estimate Report - ${est.clientName || "Project"}`,
        project: est.clientName || "Project",
        clientEmail: est.clientEmail,
        fileType: "PDF",
        category: "Reports",
        generated: formatDate(est.createdAt),
        totalCost: est.totalCost,
        totalDays: est.totalDays,
        complexity: est.complexity,
        status: "Ready",
        originalData: est
      });
    });

    return downloads.sort((a, b) => new Date(b.generated) - new Date(a.generated));
  };

  const calculateStats = (downloads) => {
    const totalDownloads = downloads.length;
    const reportsGenerated = downloads.filter(d => d.category === "Reports").length;
    const lastDownloadDate = downloads.length > 0 ? downloads[0].generated : "N/A";

    setStats({
      totalDownloads,
      reportsGenerated,
      lastDownload: lastDownloadDate
    });
  };

  const generateActivityTimeline = (estimations) => {
    return estimations.slice(0, 4).map(est => ({
      event: "Estimate Generated",
      detail: `${est.clientName || "Project"} - ${est.complexity || "Standard"} complexity`,
      time: getTimeAgo(est.createdAt),
    }));
  };

  const calculateCategoryCounts = (downloads) => {
    const categories = {};
    downloads.forEach(d => {
      categories[d.category] = (categories[d.category] || 0) + 1;
    });
    return categories;
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
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleDownload = async (item) => {
    try {
      console.log("Downloading document:", item.name);
      
      // Fetch complete estimation data
      const response = await fetch(`http://localhost:5000/api/estimations/${item.originalData._id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch estimate data");
      }
      
      const data = await response.json();
      const est = data.estimation || data;
      
      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SMART IT ESTIMATION SYSTEM", 15, 25);
      
      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Project Estimation Report", 15, 55);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 65);
      doc.text(`Document ID: ${item.id?.slice(-8).toUpperCase()}`, pageWidth - 55, 65);
      
      // Client Details
      autoTable(doc, {
        startY: 80,
        head: [["CLIENT INFORMATION", "DETAILS"]],
        body: [
          ["Client Name", est.clientName || "N/A"],
          ["Email", est.clientEmail || "N/A"],
          ["Complexity", est.complexity || "Medium"],
        ],
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        margin: { left: 15, right: 15 }
      });
      
      // Project Details
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["PROJECT DETAILS", "VALUE"]],
        body: [
          ["Project Type", est.projectType?.name || "N/A"],
          ["Timeline", `${est.totalDays || 0} Days`],
          ["Total Cost", `₹${(est.totalCost || 0).toLocaleString('en-IN')}`],
        ],
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        margin: { left: 15, right: 15 }
      });
      
      // Features
      if (est.features && est.features.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["SELECTED FEATURES", "COST"]],
          body: est.features.map(f => [f.name, `₹${(f.cost || 0).toLocaleString('en-IN')}`]),
          foot: [["Total", `₹${(est.totalCost || 0).toLocaleString('en-IN')}`]],
          theme: "striped",
          headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
          footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
          margin: { left: 15, right: 15 }
        });
      }
      
      // Footer
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is a computer-generated estimate. For any queries, please contact support.",
        15,
        finalY
      );
      
      // Save file
      const fileName = `${est.clientName || 'document'}_${item.id?.slice(-6)}.pdf`;
      doc.save(fileName);
      
      alert(`✅ Downloaded: ${fileName}`);
      
    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Failed to download PDF. Please try again.");
    }
  };

  const handleView = (item) => {
    setSelectedDocument(item);
  };

  const quickActions = [
    { label: "Generate New Report", action: "report", icon: FilePlus },
    { label: "Download Latest Report", action: "quotation", icon: Download },
  ];

  const handleQuickAction = async (action) => {
    switch (action) {
      case "report":
        navigate("/estimations");
        break;
      case "quotation":
        if (downloads.length > 0) {
          handleDownload(downloads[0]);
        } else {
          alert("No reports available. Create an estimate first.");
        }
        break;
      default:
        break;
    }
  };

  const filteredDownloads = useMemo(() => {
    return downloads.filter((item) => {
      const matchesSearch = [item.name, item.project, item.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter, downloads]);

  const categoriesList = [
    { title: "Reports", icon: FileText, count: categoryCounts["Reports"] || 0 },
  ];

  if (loading) {
    return (
      <ClientHubLayout activeItem="Downloads">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading your documents...</p>
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
            <button onClick={fetchDownloadsData} className="px-4 py-2 bg-slate-900 text-white rounded-xl">
              Retry
            </button>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  const statsCards = [
    { label: "Total Documents", value: stats.totalDownloads, icon: FileText },
    { label: "Reports", value: stats.reportsGenerated, icon: BarChart3 },
    { label: "Last Updated", value: stats.lastDownload, icon: Clock3 },
  ];

  return (
    <ClientHubLayout activeItem="Downloads">
      <main className="space-y-6">
        {/* Header Section */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Downloads center</p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">My Documents</h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Access and download all your generated project estimates and reports in PDF format.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          {statsCards.map((item) => (
            <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
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

        {/* Document Library */}
        <section className="w-full">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-950">Document Library</h2>
                <p className="mt-1 text-sm text-slate-500">Search and manage all your PDF documents.</p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div className="relative">
                  <SlidersHorizontal className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-12 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option>All</option>
                    <option>Reports</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200">
              {filteredDownloads.length === 0 ? (
                <div className="px-5 py-14 text-center text-sm text-slate-500">
                  No documents found. Create an estimate to generate PDF reports.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-5 py-4 font-medium">Document Name</th>
                        <th className="px-5 py-4 font-medium">Project</th>
                        <th className="px-5 py-4 font-medium">Type</th>
                        <th className="px-5 py-4 font-medium">Category</th>
                        <th className="px-5 py-4 font-medium">Date</th>
                        <th className="px-5 py-4 font-medium">Size</th>
                        <th className="px-5 py-4 font-medium text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDownloads.map((item) => (
                        <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50 transition">
                          <td className="px-5 py-4 font-medium text-slate-900">{item.name}</td>
                          <td className="px-5 py-4 text-slate-600">{item.project}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">
                              PDF
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{item.category}</td>
                          <td className="px-5 py-4 text-slate-600">{item.generated}</td>
                          <td className="px-5 py-4 text-slate-600">{item.size}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleView(item)}
                                className="h-8 w-8 rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
                                title="View Details"
                              >
                                <Eye size={15} className="mx-auto" />
                              </button>
                              <button
                                onClick={() => handleDownload(item)}
                                className="h-8 w-8 rounded-xl bg-slate-900 text-white transition hover:bg-slate-800"
                                title="Download PDF"
                              >
                                <Download size={15} className="mx-auto" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Recent Downloads */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-slate-950">Recent Downloads</h2>
              <p className="mt-1 text-sm text-slate-500">Quick access to your most recent PDF files.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {recentDownloads.map((file) => (
                  <div key={file.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <button onClick={() => handleDownload(file)} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800">
                        <Download className="h-3 w-3" />
                        Download PDF
                      </button>
                    </div>
                    <div className="mt-4">
                      <p className="font-semibold text-slate-950">{file.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{file.project}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <span>{file.size}</span>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700">PDF</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Overview */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-slate-950">Categories</h2>
              <p className="mt-1 text-sm text-slate-500">Documents organized by type.</p>

              <div className="mt-6 grid gap-3">
                {categoriesList.map((category) => (
                  <div key={category.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <category.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{category.title}</p>
                        <p className="text-lg font-bold text-slate-950">{category.count} files</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-slate-950">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest document actions.</p>

              <div className="mt-6 space-y-4">
                {activityTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.event}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.detail}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black tracking-tight text-slate-950">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-500">One-click workflows for frequent tasks.</p>

              <div className="mt-6 grid gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.action)}
                    className="inline-flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <action.icon className="h-3.5 w-3.5" />
                    </div>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* View Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedDocument(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Document Details</h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-slate-500">Document Name</p>
                <p className="font-semibold">{selectedDocument.name}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Project</p>
                <p className="font-semibold">{selectedDocument.project}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Client Email</p>
                <p className="font-semibold">{selectedDocument.clientEmail || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Total Cost</p>
                <p className="text-xl font-black text-slate-900">₹{(selectedDocument.totalCost || 0).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Timeline</p>
                  <p className="font-semibold">{selectedDocument.totalDays || 0} Days</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Complexity</p>
                  <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDocument.complexity === "High" ? "bg-red-100 text-red-700" :
                    selectedDocument.complexity === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {selectedDocument.complexity || "Medium"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Generated Date</p>
                <p className="font-semibold">{selectedDocument.generated}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500">File Type</p>
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">
                  {selectedDocument.fileType}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  handleDownload(selectedDocument);
                  setSelectedDocument(null);
                }}
                className="flex-1 h-10 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800"
              >
                <Download size={16} />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedDocument(null)}
                className="flex-1 h-10 rounded-xl border border-slate-200 font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientHubLayout>
  );
}