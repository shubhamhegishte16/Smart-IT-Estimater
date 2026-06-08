import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Save, FileText, Loader } from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";

function Estimations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [features, setFeatures] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    projectType: "",
    complexity: "Medium"
  });
  const [calculation, setCalculation] = useState({
    totalCost: 0,
    totalDays: 0,
    recommendedStack: []
  });
  const [generatedEstimate, setGeneratedEstimate] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          clientName: user.name || "",
          clientEmail: user.email || ""
        }));
      } catch (e) {}
    }
    
    fetchFeatures();
    fetchProjectTypes();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/features");
      const data = await response.json();
      const featuresData = Array.isArray(data) ? data : data.features || [];
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error fetching features:", error);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/project-types");
      const data = await response.json();
      const typesData = Array.isArray(data) ? data : data.projectTypes || [];
      setProjectTypes(typesData);
      console.log("Project types loaded:", typesData);
    } catch (error) {
      console.error("Error fetching project types:", error);
    }
  };

  const toggleFeature = (feature) => {
    if (selectedFeatures.find(f => f._id === feature._id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f._id !== feature._id));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  // Calculate total cost and days whenever features change
  useEffect(() => {
    const totalCost = selectedFeatures.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
    const totalDays = selectedFeatures.reduce((sum, f) => sum + (Number(f.weeks) || 0), 0);
    
    const stack = [];
    if (selectedFeatures.some(f => f.name?.toLowerCase().includes("react"))) stack.push("React.js");
    if (selectedFeatures.some(f => f.name?.toLowerCase().includes("node"))) stack.push("Node.js");
    if (selectedFeatures.some(f => f.name?.toLowerCase().includes("mongo"))) stack.push("MongoDB");
    
    setCalculation({
      totalCost: totalCost || 0,
      totalDays: totalDays || 0,
      recommendedStack: stack.length ? stack : ["MERN Stack"]
    });
  }, [selectedFeatures]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.clientName) {
      alert("Please enter your name");
      return;
    }
    if (!formData.clientEmail) {
      alert("Please enter your email");
      return;
    }
    if (!formData.projectType) {
      alert("Please select a project type");
      return;
    }
    if (selectedFeatures.length === 0) {
      alert("Please select at least one feature");
      return;
    }
    
    setSaving(true);
    
    try {
      const estimationData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        projectType: formData.projectType, // This is the ObjectId
        features: selectedFeatures.map(f => f._id),
        totalCost: Number(calculation.totalCost),
        totalDays: Number(calculation.totalDays),
        complexity: formData.complexity,
        recommendedStack: calculation.recommendedStack,
        status: "draft"
      };
      
      console.log("Sending to backend:", JSON.stringify(estimationData, null, 2));
      
      const response = await fetch("http://localhost:5000/api/estimations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimationData)
      });
      
      const data = await response.json();
      console.log("Response from backend:", data);
      
      if (response.ok && data.success) {
        setGeneratedEstimate(data.estimation);
        alert("✅ Estimate saved successfully!");
        
        // Ask if user wants to generate report
        if (confirm("Estimate saved! Do you want to generate a report now?")) {
          await generateReport(data.estimation._id);
        }
      } else {
        throw new Error(data.message || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving estimate:", error);
      alert("❌ Failed to save estimate: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const generateReport = async (estimateId) => {
    const id = estimateId || generatedEstimate?._id;
    
    if (!id) {
      alert("No estimate found to generate report");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Generating report for estimate:", id);
      
      const response = await fetch(`http://localhost:5000/api/estimations/${id}/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf" })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert("✅ Report generated successfully! View it in Downloads page.");
        navigate("/client/downloads");
      } else {
        throw new Error(data.message || "Failed to generate report");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("❌ Failed to generate report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (projectTypes.length === 0 && !loading) {
    return (
      <ClientHubLayout activeItem="New Estimate">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Loading project types... Please wait.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      </ClientHubLayout>
    );
  }

  return (
    <ClientHubLayout activeItem="New Estimate">
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-tight">Project Details</h2>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Project Type *</label>
                    <select
                      required
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(pt => (
                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Complexity</label>
                    <select
                      value={formData.complexity}
                      onChange={(e) => setFormData({...formData, complexity: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-tight">Select Features</h2>
                
                <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                  {features.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">Loading features...</p>
                  ) : (
                    features.map(feature => (
                      <label key={feature._id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.some(f => f._id === feature._id)}
                          onChange={() => toggleFeature(feature)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{feature.name}</p>
                          <p className="text-sm text-slate-500">{feature.description}</p>
                          <div className="flex gap-3 mt-1 text-xs text-slate-600">
                            <span>₹{Number(feature.cost || 0).toLocaleString()}</span>
                            <span>{Number(feature.weeks || 0)} weeks</span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sticky top-6">
                <h2 className="text-xl font-black tracking-tight">Estimate Summary</h2>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between pb-3 border-b">
                    <span>Selected Features:</span>
                    <span className="font-semibold">{selectedFeatures.length}</span>
                  </div>
                  
                  <div className="flex justify-between pb-3 border-b">
                    <span>Total Cost:</span>
                    <span className="text-2xl font-black">₹{(calculation.totalCost || 0).toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between pb-3 border-b">
                    <span>Total Timeline:</span>
                    <span className="font-semibold">{calculation.totalDays || 0} weeks</span>
                  </div>
                  
                  <div className="pb-3 border-b">
                    <span className="block mb-2">Complexity:</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                      {formData.complexity}
                    </span>
                  </div>
                  
                  <div>
                    <span className="block mb-2">Recommended Stack:</span>
                    <div className="flex flex-wrap gap-2">
                      {calculation.recommendedStack.map(stack => (
                        <span key={stack} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{stack}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving ? <Loader className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {saving ? "Saving..." : "Save Estimate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ClientHubLayout>
  );
}

export default Estimations;