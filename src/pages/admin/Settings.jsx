import AdminLayout from "../../components/admin/AdminLayout";

function Settings() {
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
              placeholder="Company Name"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="email"
              placeholder="Company Email"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-lg p-3"
            />

            <textarea
              placeholder="Company Address"
              rows="3"
              className="w-full border rounded-lg p-3"
            ></textarea>
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save Changes
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
              placeholder="Low Complexity (1-20)"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="Medium Complexity (21-50)"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="number"
              placeholder="High Complexity (51+)"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save Rules
          </button>
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Currency Settings
          </h2>

          <div className="space-y-3">
            <select className="w-full border rounded-lg p-3">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>

            <input
              type="number"
              placeholder="Tax Percentage"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save Currency
          </button>
        </div>

        {/* PDF Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            PDF Quotation Settings
          </h2>

          <div className="space-y-3">
            <input
              type="file"
              className="w-full border rounded-lg p-3"
            />

            <textarea
              placeholder="Footer Text for PDF"
              rows="3"
              className="w-full border rounded-lg p-3"
            ></textarea>
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save PDF Settings
          </button>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            System Settings
          </h2>

          <div className="flex flex-col md:flex-row gap-6">

            <div>
              <label className="block mb-2 font-medium">
                Theme
              </label>

              <select className="border rounded-lg p-3">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email Notifications
              </label>

              <select className="border rounded-lg p-3">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>

          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save System Settings
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Settings;