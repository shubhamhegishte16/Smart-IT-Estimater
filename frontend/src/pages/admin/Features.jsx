import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import * as FeatureService from "../../services/featureService.js";

console.log("FeatureService:", FeatureService);
import {
  LayoutDashboard,
  Layers,
  DollarSign,
  FolderKanban,
  FileSpreadsheet,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X
} from "lucide-react";

function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  // Modal Form States matching image_0fc2fe.png
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Core",
    cost: 0,
    weeks: 0,
    complexity: 1,
    isActive: true
  });

  const fetchFeatures = async () => {
    try {
      const data = await FeatureService.getFeatures();
      setFeatures(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const getCategoryStyles = (category) => {
    switch (category?.toLowerCase()) {
      case "core":
        return "bg-[#EAE5DC] text-[#2D2D2D]";
      case "growth":
        return "bg-[#E3ECE6] text-[#1E4631]";
      case "advanced":
        return "bg-[#EDE2D4] text-[#6A4B23]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openAddModal = () => {
    setEditingFeature(null);
    setFormData({
      name: "",
      description: "",
      category: "Core",
      cost: 0,
      weeks: 0,
      complexity: 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description || "",
      category: feature.category || "Core",
      cost: feature.cost || 0,
      weeks: feature.weeks || 0,
      complexity: feature.complexity || 1,
      isActive: feature.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFeature) {
        // Update Action
        const updated = await FeatureService.updateFeature(editingFeature._id, formData);
        setFeatures(features.map((f) => (f._id === updated._id ? updated : f)));
      } else {
        // Create Action
        const created = await FeatureService.createFeature(formData);
        setFeatures([...features, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle active status directly from the table view row
  const handleToggleActive = async (feature) => {
    const updatedStatus = { ...feature, isActive: !(feature.isActive ?? true) };
    try {
      const updated = await FeatureService.updateFeature(feature._id, updatedStatus);
      setFeatures(features.map((f) => (f._id === updated._id ? updated : f)));
    } catch (error) {
      console.error("Failed to change activation status:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this feature?");
    if (!confirmDelete) return;

    try {
      await FeatureService.deleteFeature(id);
      setFeatures(features.filter((feature) => feature._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>

      {/* ================= MAIN DASHBOARD CONTENT ================= */}
      <div className="w-full">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage Features
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add, edit, or disable features clients can select.
            </p>
          </div>

          <button onClick={openAddModal} className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={18} />
            Add feature
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">          {loading ? (
          <div className="p-12 text-[#55635C] text-center font-medium">
            Loading features from server...
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E5E3D8]">
                <th className="p-3 pl-6 text-[11px] font-bold uppercase tracking-widest text-[#737E78] w-[35%]">Name</th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-widest text-[#737E78]">Category</th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-widest text-[#737E78]">Cost</th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-widest text-[#737E78]">Weeks</th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-widest text-[#737E78]">Complexity</th>
                <th className="p-3 text-[11px] font-bold uppercase tracking-widest text-[#737E78]">Active</th>
                <th className="p-3 pr-6 w-24"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E3D8]/60">
              {features.map((feature) => (
                <tr key={feature._id} className="hover:bg-[#F6F5EE] transition-colors">
                  <td className="p-3 pl-6 align-middle">
                    <div className="font-semibold text-[#0D1B15] text-[15px]">{feature.name}</div>
                    {feature.description && (
                      <div className="text-[13px] text-[#737E78] mt-0.5 font-normal">{feature.description}</div>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${getCategoryStyles(feature.category)}`}>
                      {feature.category || "core"}
                    </span>
                  </td>
                  <td className="p-4 align-middle font-medium text-[#0D1B15]">
                    Rs {feature.cost?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 align-middle text-[#0D1B15]">{feature.weeks || 1}</td>
                  <td className="p-4 align-middle text-[#0D1B15]">{feature.complexity || 1}</td>
                  <td className="p-4 align-middle">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feature.isActive ?? true}
                        onChange={() => handleToggleActive(feature)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E5E3D8] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A0A0A]"></div>
                    </label>
                  </td>
                  <td className="p-4 pr-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button onClick={() => openEditModal(feature)} className="text-[#737E78] hover:text-[#0D1B15] transition-colors">
                        <Pencil size={17} />
                      </button>
                      <button onClick={() => handleDelete(feature._id)} className="text-[#E05353] hover:text-[#C03939] transition-colors">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Missing Data Fallback State */}
              {features.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-10 text-center text-[#737E78] font-medium text-sm"
                  >
                    No Features Found. Click "Add feature" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        </div>
      </div>

      {/* ================= MODAL INTERFACE (image_0fc2fe.png) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-[540px] p-6 shadow-xl relative font-sans text-[#0D1B15]">

            {/* Header Area */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold tracking-tight">
                {editingFeature ? "Edit feature" : "New feature"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#737E78] hover:text-[#0D1B15] p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Interactive Input Fields Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* Feature Title Name input row */}
              <div>
                <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all"
                />
              </div>

              {/* Description Body element text-area */}
              <div>
                <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all resize-none"
                />
              </div>

              {/* Categorization & Pricing rows element mapping */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23737E78%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value="Core">Core</option>
                    <option value="Growth">Growth</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Delivery Speed / Build Complexity inputs container row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Weeks</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.weeks}
                    onChange={(e) => setFormData({ ...formData, weeks: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#0D1B15] mb-1.5">Complexity (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.complexity}
                    onChange={(e) => setFormData({ ...formData, complexity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E5E3D8] bg-white focus:outline-hidden focus:border-[#1E4631] focus:ring-1 focus:ring-[#1E4631] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Activation Switch Block Container mapping image_0fc2fe.png */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5E3D8]/80 bg-linear-to-b from-white to-[#FBFBFA]">
                <span className="text-sm font-medium">Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#E5E3D8] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A0A0A]"></div>
                </label>
              </div>

              {/* Form Action Controls bar */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E5E3D8] bg-white text-[#0D1B15] hover:bg-[#F6F5EE] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default Features;