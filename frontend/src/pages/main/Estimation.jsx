import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LayoutGrid,
  Mail,
  Phone,
  Sparkles,
  User,
  Home,
  FileText,
  BarChart3,
  LogOut,
  Download,
  Printer,
} from "lucide-react";
import { getFeatures } from "../../services/featureService";
import { getProjectTypes } from "../../services/projectTypeService";
import { createEstimation } from "../../services/estimationService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const steps = ["Project Type", "Features", "Client Details"];

const iconPool = [Globe2, LayoutGrid, Sparkles];

const money = (value) => {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
};

const fallbackDescription = (name) => {
  const title = name?.toLowerCase() || "";

  if (title.includes("mobile")) {
    return "A polished app experience for customers on Android, iOS, or both.";
  }
  if (title.includes("e-commerce") || title.includes("shop")) {
    return "A complete selling platform with catalog, checkout, and order flow.";
  }
  if (title.includes("website")) {
    return "A modern web presence for brands, services, campaigns, or content.";
  }
  if (title.includes("saas") || title.includes("web app")) {
    return "A browser-based product with dashboards, users, workflows, and data.";
  }
  if (title.includes("ai")) {
    return "An intelligent software system powered by automation and smart workflows.";
  }
  return "A custom digital product shaped around your business goals and users.";
};

const getComplexity = (totalCost, featureCount) => {
  if (totalCost > 100000 || featureCount > 5) return "High";
  if (totalCost > 50000 || featureCount > 2) return "Medium";
  return "Low";
};

function Estimation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("estimate");
  const [step, setStep] = useState(1);
  const [projectTypes, setProjectTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [client, setClient] = useState({
    clientName: "",
    clientEmail: "",
    phone: "",
    company: "",
  });
  const [generatedResult, setGeneratedResult] = useState(null);

  // Get logged-in user data on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setClient(prev => ({
          ...prev,
          clientName: user.name || "",
          clientEmail: user.email || "",
          company: user.company || "",
          phone: user.phone || "",
        }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const loadEstimatorData = async () => {
      try {
        const [typeData, featureData] = await Promise.all([
          getProjectTypes(),
          getFeatures(),
        ]);

        setProjectTypes(typeData);
        setFeatures(
          featureData.filter((feature) => feature.isActive ?? true)
        );
      } catch (fetchError) {
        console.error(fetchError);
        setError("Could not load estimator data.");
      } finally {
        setLoading(false);
      }
    };

    loadEstimatorData();
  }, []);

  const selectedFeatureObjects = useMemo(() => {
    return features.filter((feature) =>
      selectedFeatures.includes(feature._id)
    );
  }, [features, selectedFeatures]);

  const estimate = useMemo(() => {
    const baseCost = Number(selectedProjectType?.baseCost || 0);
    const featureCost = selectedFeatureObjects.reduce(
      (total, feature) => total + Number(feature.cost || 0),
      0
    );
    const baseDays = Number(selectedProjectType?.baseDays || 0);
    const featureDays = selectedFeatureObjects.reduce(
      (total, feature) => total + Math.round(Number(feature.weeks || 0) * 7),
      0
    );
    const totalCost = baseCost + featureCost;
    const totalDays = baseDays + featureDays;

    return {
      cost: totalCost,
      days: totalDays,
      complexity: getComplexity(totalCost, selectedFeatureObjects.length),
    };
  }, [selectedProjectType, selectedFeatureObjects]);

  const toggleFeature = (id) => {
    setSelectedFeatures((current) =>
      current.includes(id)
        ? current.filter((featureId) => featureId !== id)
        : [...current, id]
    );
  };

  const updateClient = (event) => {
    const { name, value } = event.target;
    setClient((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!selectedProjectType || !client.clientName || !client.clientEmail) {
      setError("Please add project type, name, and email.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const savedEstimate = await createEstimation({
        clientName: client.clientName,
        clientEmail: client.clientEmail,
        projectTypeId: selectedProjectType._id,
        featureIds: selectedFeatures,
        totalCost: estimate.cost,
        totalDays: estimate.days,
        complexity: estimate.complexity,
      });

      // Show results instead of redirecting
      setGeneratedResult({
        id: savedEstimate._id,
        clientName: client.clientName,
        clientEmail: client.clientEmail,
        phone: client.phone,
        company: client.company,
        projectType: selectedProjectType,
        features: selectedFeatureObjects,
        totalCost: estimate.cost,
        totalDays: estimate.days,
        complexity: estimate.complexity,
        stack: savedEstimate.recommendedStack?.join(" + ") || "React + Node.js + MongoDB",
        createdAt: new Date().toLocaleDateString(),
      });
      
      // Switch to results tab
      setActiveTab("results");
      
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save this estimate.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedResult) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SMART IT ESTIMATION SYSTEM", 15, 22);

    // Reset color
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Project Estimation Report", 15, 55);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 65);
    doc.text(`Estimate ID: ${generatedResult.id?.slice(-8).toUpperCase() || "N/A"}`, pageWidth - 50, 65);

    // Client Details Table
    autoTable(doc, {
      startY: 75,
      head: [["Client Information", "Details"]],
      body: [
        ["Client Name", generatedResult.clientName || "N/A"],
        ["Email", generatedResult.clientEmail || "N/A"],
        ["Phone", generatedResult.phone || "N/A"],
        ["Company", generatedResult.company || "N/A"],
        ["Complexity", generatedResult.complexity || "N/A"],
      ],
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    });

    // Project Details Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Project Details", "Value"]],
      body: [
        ["Project Type", generatedResult.projectType?.name || "N/A"],
        ["Timeline", `${generatedResult.totalDays || 0} Days`],
        ["Technology Stack", generatedResult.stack || "N/A"],
        ["Total Cost", money(generatedResult.totalCost)],
      ],
      theme: "striped",
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    });

    // Features Table
    if (generatedResult.features && generatedResult.features.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Selected Features", "Cost"]],
        body: generatedResult.features.map(f => [f.name, money(f.cost)]),
        foot: [["Total", money(generatedResult.totalCost)]],
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      });
    }

    // Footer
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is a computer-generated estimate. For any queries, please contact support.",
      15,
      footerY
    );
    doc.text(
      "Generated by Smart IT Estimation System",
      pageWidth - 70,
      footerY
    );

    doc.save(`estimate_${generatedResult.clientName || "client"}_${new Date().toLocaleDateString()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const handleHome = () => {
    // Go to landing page without logging out
    navigate("/");
  };

  // Navigation Bar Component
  const NavBar = () => (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleHome}>
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-lg">Beacon</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={handleHome}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "home"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Home size={16} />
              Home
            </button>
            <button
              onClick={() => {
                setActiveTab("estimate");
                setGeneratedResult(null);
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "estimate"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FileText size={16} />
              Estimate
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "results"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <BarChart3 size={16} />
              Results
            </button>
          </div>

          {/* User Menu & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">
                  {client.clientName?.charAt(0) || "U"}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:block">
                <button onClick={() => navigate("/client/dashboard")}>{client.clientName || "Guest"}</button>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Results Component with Download
  const ResultsView = () => {
    if (!generatedResult) {
      return (
        <div className="text-center py-20">
          <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">No Results Yet</h2>
          <p className="text-gray-500 mt-2">Please complete the estimation form to see results.</p>
          <button
            onClick={() => setActiveTab("estimate")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-xl"
          >
            Go to Estimate
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto" id="estimate-results">
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-black text-white px-8 py-6">
            <h1 className="text-2xl font-bold">Estimate Summary</h1>
            <p className="text-gray-300 mt-1">Thank you for choosing Smart IT Estimator</p>
          </div>

          {/* Client Info */}
          <div className="px-8 py-6 border-b">
            <h2 className="text-lg font-semibold mb-3">Client Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{generatedResult.clientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{generatedResult.clientEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{generatedResult.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{generatedResult.company || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Generated On</p>
                <p className="font-medium">{generatedResult.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimate ID</p>
                <p className="font-medium">{generatedResult.id?.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="px-8 py-6 border-b">
            <h2 className="text-lg font-semibold mb-3">Project Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Project Type</p>
                <p className="font-medium">{generatedResult.projectType?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Complexity</p>
                <p className="font-medium">{generatedResult.complexity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-medium">{generatedResult.totalDays} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tech Stack</p>
                <p className="font-medium">{generatedResult.stack}</p>
              </div>
            </div>

            {/* Selected Features */}
            {generatedResult.features && generatedResult.features.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Selected Features</p>
                <div className="space-y-2">
                  {generatedResult.features.map((feature, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b">
                      <span>{feature.name}</span>
                      <span className="font-medium">{money(feature.cost)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total Cost */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Estimated Cost</span>
              <span className="text-3xl font-black">{money(generatedResult.totalCost)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">*This is an estimate. Final pricing may vary based on requirements.</p>
          </div>

          {/* Download Actions */}
          <div className="px-8 py-6 flex gap-4 border-t">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 h-12 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <Download size={18} />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 h-12 rounded-xl border border-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={() => {
                setActiveTab("estimate");
                setGeneratedResult(null);
                setStep(1);
                setSelectedProjectType(null);
                setSelectedFeatures([]);
              }}
              className="flex-1 h-12 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50"
            >
              New Estimate
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Estimate Form Component
  const EstimateForm = () => (
    <>
      <StepHeader step={step} />

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0 rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm md:p-8">
          {loading ? (
            <div className="py-20 text-center text-[#666666]">
              Loading estimator data...
            </div>
          ) : (
            <>
              {step === 1 && (
                <ProjectTypeSection
                  projectTypes={projectTypes}
                  selectedProjectType={selectedProjectType}
                  setSelectedProjectType={setSelectedProjectType}
                />
              )}

              {step === 2 && (
                <FeatureSection
                  features={features}
                  selectedFeatures={selectedFeatures}
                  toggleFeature={toggleFeature}
                />
              )}

              {step === 3 && (
                <ClientSection
                  client={client}
                  updateClient={updateClient}
                  selectedProjectType={selectedProjectType}
                  selectedFeatureObjects={selectedFeatureObjects}
                  estimate={estimate}
                />
              )}
            </>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-sm font-bold text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((current) => current + 1)}
                disabled={step === 1 && !selectedProjectType}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A0A0A]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#0A0A0A]/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Generate Estimate"}
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </section>

        <LivePreview
          selectedProjectType={selectedProjectType}
          selectedFeatureObjects={selectedFeatureObjects}
          estimate={estimate}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#0A0A0A]">
      <NavBar />

      <main className="mx-auto max-w-7xl px-5 py-10">
        {activeTab === "estimate" && <EstimateForm />}
        {activeTab === "results" && <ResultsView />}
        {activeTab === "home" && (
          <div className="text-center py-20">
            <Home size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600">Welcome to Smart IT Estimator</h2>
            <p className="text-gray-500 mt-2">Click on Estimate to create a new project estimate</p>
            <button
              onClick={() => setActiveTab("estimate")}
              className="mt-6 px-6 py-2 bg-black text-white rounded-xl"
            >
              Start New Estimate
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components (StepHeader, ProjectTypeSection, FeatureSection, ClientSection, InputRow, SummaryLine, LivePreview)
// ... (keep all the helper components from your original file)

function StepHeader({ step }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {steps.map((label, index) => {
        const number = index + 1;
        const isActive = step >= number;

        return (
          <div key={label} className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black ${
                  isActive
                    ? "bg-[#0A0A0A] text-white shadow-md shadow-[#0A0A0A]/20"
                    : "bg-[#F3F4F6] text-[#666666]"
                }`}
              >
                {number}
              </span>
              <span className="font-semibold text-[#0A0A0A]">
                {label}
              </span>
            </div>
            {number < steps.length && (
              <span className="hidden h-px w-20 bg-[#E5E5E5] sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProjectTypeSection({
  projectTypes,
  selectedProjectType,
  setSelectedProjectType,
}) {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-3xl font-black tracking-tight">
          What are we building?
        </h1>
        <p className="mt-2 text-[#666666]">
          Choose the type of product you want to build.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projectTypes.map((type, index) => {
          const Icon = iconPool[index % iconPool.length];
          const selected = selectedProjectType?._id === type._id;

          return (
            <button
              key={type._id}
              onClick={() => setSelectedProjectType(type)}
              className={`relative rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-[#0A0A0A] bg-[#F5F5F5] ring-4 ring-[#0A0A0A]/12 shadow-[0_22px_60px_rgba(0,0,0,0.16)]"
                  : "border-[#E5E5E5] bg-white hover:border-[#0A0A0A] hover:bg-[#FAFAFA]"
              }`}
            >
              {selected && (
                <span className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-[#0A0A0A] text-white shadow-lg shadow-[#0A0A0A]/25">
                  <Check size={19} strokeWidth={3} />
                </span>
              )}
              <span
                className={`mb-6 grid h-12 w-12 place-items-center rounded-2xl ${
                  selected ? "bg-[#0A0A0A] text-white" : "bg-[#F3F4F6] text-[#0A0A0A]"
                }`}
              >
                <Icon size={24} />
              </span>
              <h3 className="text-lg font-black text-[#0A0A0A]">
                {type.name}
              </h3>
              <p className="mt-2 min-h-10 text-sm leading-6 text-[#666666]">
                {type.description || fallbackDescription(type.name)}
              </p>
              <div className="mt-5 flex items-center justify-between text-sm font-bold text-[#0A0A0A]">
                <span>From {money(type.baseCost)}</span>
                <span>{type.baseDays} days</span>
              </div>
            </button>
          );
        })}
      </div>

      {projectTypes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5E5E5] p-8 text-center text-[#666666]">
          No project types are available yet.
        </div>
      )}
    </>
  );
}

function FeatureSection({ features, selectedFeatures, toggleFeature }) {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-3xl font-black tracking-tight">
          Select features
        </h1>
        <p className="mt-2 text-[#666666]">
          Pick the features you need. Your live estimate updates as you choose.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const selected = selectedFeatures.includes(feature._id);

          return (
            <button
              key={feature._id}
              onClick={() => toggleFeature(feature._id)}
              className={`relative rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-[#0A0A0A] bg-[#F5F5F5] ring-4 ring-[#0A0A0A]/12 shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
                  : "border-[#E5E5E5] bg-white hover:border-[#0A0A0A] hover:bg-[#FAFAFA]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#0A0A0A]">
                    {feature.name}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm leading-6 text-[#666666]">
                    {feature.description || "No description added."}
                  </p>
                </div>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                    selected
                      ? "border-[#0A0A0A] bg-[#0A0A0A] text-white shadow-lg shadow-[#0A0A0A]/25"
                      : "border-[#E5E5E5] bg-white text-transparent"
                  }`}
                >
                  <Check size={16} strokeWidth={3} />
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 font-bold text-[#555555]">
                  {feature.category || "Feature"}
                </span>
                <span className="font-black text-[#0A0A0A]">
                  {money(feature.cost)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {features.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E5E5E5] p-8 text-center text-[#666666]">
          No active features are available yet.
        </div>
      )}
    </>
  );
}

function ClientSection({
  client,
  updateClient,
  selectedProjectType,
  selectedFeatureObjects,
  estimate,
}) {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-3xl font-black tracking-tight">
          Client details
        </h1>
        <p className="mt-2 text-[#666666]">
          Add contact details and review the selected items before generating the estimate.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <InputRow
            icon={User}
            name="clientName"
            placeholder="Client name"
            value={client.clientName}
            onChange={updateClient}
          />
          <InputRow
            icon={Mail}
            name="clientEmail"
            placeholder="Email address"
            type="email"
            value={client.clientEmail}
            onChange={updateClient}
          />
          <InputRow
            icon={Phone}
            name="phone"
            placeholder="Phone number"
            value={client.phone}
            onChange={updateClient}
          />
          <InputRow
            icon={LayoutGrid}
            name="company"
            placeholder="Company"
            value={client.company}
            onChange={updateClient}
          />
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-5">
          <h2 className="mb-4 text-lg font-black">Selected summary</h2>
          <SummaryLine label="Project" value={selectedProjectType?.name || "-"} />
          <SummaryLine label="Base cost" value={money(selectedProjectType?.baseCost)} />
          <SummaryLine label="Features" value={`${selectedFeatureObjects.length}`} />
          <SummaryLine label="Timeline" value={`${estimate.days || 0} days`} />
          <SummaryLine label="Complexity" value={estimate.complexity} />

          <div className="mt-5 border-t border-[#E5E5E5] pt-5">
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#666666]">
              Chosen features
            </p>
            {selectedFeatureObjects.length === 0 ? (
              <p className="text-sm text-[#666666]">No features selected.</p>
            ) : (
              <div className="space-y-2">
                {selectedFeatureObjects.map((feature) => (
                  <SummaryLine
                    key={feature._id}
                    label={feature.name}
                    value={money(feature.cost)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InputRow({ icon: Icon, ...props }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3 focus-within:border-[#0A0A0A] focus-within:ring-4 focus-within:ring-[#0A0A0A]/10">
      <Icon className="text-[#0A0A0A]" size={18} />
      <input
        {...props}
        className="h-10 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9CA3AF]"
      />
    </label>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-[#666666]">{label}</span>
      <span className="text-right font-bold text-[#0A0A0A]">{value}</span>
    </div>
  );
}

function LivePreview({
  selectedProjectType,
  selectedFeatureObjects,
  estimate,
}) {
  return (
    <aside className="h-fit rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm lg:sticky lg:top-28">
      <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#666666]">
        Live Preview
      </p>

      {!selectedProjectType ? (
        <p className="text-[#666666]">Pick a project type to start.</p>
      ) : (
        <>
          <h2 className="text-4xl font-black tracking-tight text-[#0A0A0A]">
            {money(estimate.cost)}
          </h2>
          <p className="mt-2 text-sm text-[#666666]">
            {estimate.days || 0} days · {estimate.complexity}
          </p>

          <div className="my-5 h-px bg-[#E5E5E5]" />

          <SummaryLine label="Project" value={selectedProjectType.name} />
          <SummaryLine
            label="Features"
            value={`${selectedFeatureObjects.length}`}
          />
          <SummaryLine
            label="Timeline"
            value={`${estimate.days || 0} days`}
          />
          <SummaryLine label="Quality" value="Production" />
        </>
      )}
    </aside>
  );
}

export default Estimation;