import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";

function Settings() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    currency: "INR",
    quotationPrefix: "",
    lowComplexityLimit: 50000,
    mediumComplexityLimit: 100000,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/settings"
      );

      setSettings(res.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/settings",
        settings
      );

      setSettings(res.data);

      alert("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? Number(value)
          : value,
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          Loading settings...
        </div>
      </AdminLayout>
    );
  }

return (
  <AdminLayout>
    <div className="w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Configure company information, estimation rules, and system preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Company Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Company Information
          </h2>

          <div className="space-y-3">

            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              name="companyEmail"
              value={settings.companyEmail}
              onChange={handleChange}
              placeholder="Company Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              name="companyPhone"
              value={settings.companyPhone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              name="companyAddress"
              value={settings.companyAddress}
              onChange={handleChange}
              rows="3"
              placeholder="Company Address"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Save Company Information
          </button>
        </div>

        {/* Estimation Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Estimation Settings
          </h2>

          <div className="space-y-3">

            <input
              type="number"
              name="lowComplexityLimit"
              value={settings.lowComplexityLimit}
              onChange={handleChange}
              placeholder="Low Complexity Limit"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="number"
              name="mediumComplexityLimit"
              value={settings.mediumComplexityLimit}
              onChange={handleChange}
              placeholder="Medium Complexity Limit"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Save Estimation Rules
          </button>
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Currency Settings
          </h2>

          <div className="space-y-3">

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            <input
              type="text"
              name="quotationPrefix"
              value={settings.quotationPrefix}
              onChange={handleChange}
              placeholder="Quotation Prefix"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Save Currency Settings
          </button>
        </div>

        {/* Current Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Current Configuration
          </h2>

          <div className="space-y-3 text-sm text-gray-700">

            <div>
              <span className="font-semibold">Company:</span>{" "}
              {settings.companyName || "-"}
            </div>

            <div>
              <span className="font-semibold">Email:</span>{" "}
              {settings.companyEmail || "-"}
            </div>

            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {settings.companyPhone || "-"}
            </div>

            <div>
              <span className="font-semibold">Currency:</span>{" "}
              {settings.currency}
            </div>

            <div>
              <span className="font-semibold">Quotation Prefix:</span>{" "}
              {settings.quotationPrefix || "-"}
            </div>

            <div>
              <span className="font-semibold">Low Complexity:</span>{" "}
              ₹{settings.lowComplexityLimit?.toLocaleString()}
            </div>

            <div>
              <span className="font-semibold">Medium Complexity:</span>{" "}
              ₹{settings.mediumComplexityLimit?.toLocaleString()}
            </div>

          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
);
}

export default Settings;