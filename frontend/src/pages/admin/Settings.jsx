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
      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Company Information */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
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
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              name="companyEmail"
              value={settings.companyEmail}
              onChange={handleChange}
              placeholder="Company Email"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              name="companyPhone"
              value={settings.companyPhone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border rounded-lg p-3"
            />

            <textarea
              name="companyAddress"
              value={settings.companyAddress}
              onChange={handleChange}
              placeholder="Company Address"
              rows="3"
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save Company Information
          </button>
        </div>

        {/* Estimation Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
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
              className="w-full border rounded-lg p-3"
            />

            <input
              type="number"
              name="mediumComplexityLimit"
              value={settings.mediumComplexityLimit}
              onChange={handleChange}
              placeholder="Medium Complexity Limit"
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save Estimation Rules
          </button>
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Currency Settings
          </h2>

          <div className="space-y-3">

            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
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
              className="w-full border rounded-lg p-3"
            />

          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Save Currency Settings
          </button>
        </div>

        {/* Current Settings Preview */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Current Configuration
          </h2>

          <div className="space-y-2 text-sm">

            <p>
              <strong>Company:</strong>{" "}
              {settings.companyName}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {settings.companyEmail}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {settings.companyPhone}
            </p>

            <p>
              <strong>Currency:</strong>{" "}
              {settings.currency}
            </p>

            <p>
              <strong>Quotation Prefix:</strong>{" "}
              {settings.quotationPrefix}
            </p>

            <p>
              <strong>Low Complexity:</strong>{" "}
              {settings.lowComplexityLimit}
            </p>

            <p>
              <strong>Medium Complexity:</strong>{" "}
              {settings.mediumComplexityLimit}
            </p>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Settings;