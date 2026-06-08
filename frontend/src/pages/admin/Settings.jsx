// SettingsAdmin.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getSettings, updateSettings, updateCompanyInfo, updateEstimationRules } from "../../services/settingsService";
import { Save, Building2, Settings as SettingsIcon, DollarSign } from "lucide-react";

function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    
    const [settings, setSettings] = useState({
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        currency: "INR",
        currencySymbol: "₹",
        quotationPrefix: "",
        lowComplexityLimit: 50000,
        mediumComplexityLimit: 100000,
        highComplexityLimit: 200000,
        taxRate: 18,
        enableTax: true,
        enableNotifications: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error("Error fetching settings:", error);
            setMessage({ type: "error", text: "Failed to load settings" });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        
        try {
            const data = await updateSettings(settings);
            setSettings(prev => ({ ...prev, ...data }));
            setMessage({ type: "success", text: "Settings saved successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("Error updating settings:", error);
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value),
        }));
    };

    const handleCompanySave = async () => {
        setSaving(true);
        try {
            await updateCompanyInfo({
                companyName: settings.companyName,
                companyEmail: settings.companyEmail,
                companyPhone: settings.companyPhone,
                companyAddress: settings.companyAddress
            });
            setMessage({ type: "success", text: "Company info saved!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save company info" });
        } finally {
            setSaving(false);
        }
    };

    const handleRulesSave = async () => {
        setSaving(true);
        try {
            await updateEstimationRules({
                lowComplexityLimit: settings.lowComplexityLimit,
                mediumComplexityLimit: settings.mediumComplexityLimit,
                highComplexityLimit: settings.highComplexityLimit,
                taxRate: settings.taxRate,
                enableTax: settings.enableTax
            });
            setMessage({ type: "success", text: "Estimation rules saved!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save estimation rules" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="w-full">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure company information, estimation rules, and system preferences.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save All Settings"}
                    </button>
                </div>

                {message && (
                    <div className={`mb-4 p-4 rounded-xl ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-black rounded-xl text-white">
                                <Building2 size={20} />
                            </div>
                            <h2 className="text-lg font-semibold">Company Information</h2>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="companyName"
                                value={settings.companyName}
                                onChange={handleChange}
                                placeholder="Company Name"
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <input
                                type="email"
                                name="companyEmail"
                                value={settings.companyEmail}
                                onChange={handleChange}
                                placeholder="Company Email"
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <input
                                type="text"
                                name="companyPhone"
                                value={settings.companyPhone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <textarea
                                name="companyAddress"
                                value={settings.companyAddress}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Company Address"
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <button
                            onClick={handleCompanySave}
                            disabled={saving}
                            className="mt-5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium"
                        >
                            Save Company Info
                        </button>
                    </div>

                    {/* Estimation Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-black rounded-xl text-white">
                                <SettingsIcon size={20} />
                            </div>
                            <h2 className="text-lg font-semibold">Estimation Rules</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Low Complexity Limit ({settings.currencySymbol})</label>
                                <input
                                    type="number"
                                    name="lowComplexityLimit"
                                    value={settings.lowComplexityLimit}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medium Complexity Limit ({settings.currencySymbol})</label>
                                <input
                                    type="number"
                                    name="mediumComplexityLimit"
                                    value={settings.mediumComplexityLimit}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">High Complexity Limit ({settings.currencySymbol})</label>
                                <input
                                    type="number"
                                    name="highComplexityLimit"
                                    value={settings.highComplexityLimit}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    name="taxRate"
                                    value={settings.taxRate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="enableTax"
                                    checked={settings.enableTax}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Enable Tax Calculation</span>
                            </label>
                        </div>

                        <button
                            onClick={handleRulesSave}
                            disabled={saving}
                            className="mt-5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium"
                        >
                            Save Estimation Rules
                        </button>
                    </div>

                    {/* Currency Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-black rounded-xl text-white">
                                <DollarSign size={20} />
                            </div>
                            <h2 className="text-lg font-semibold">Currency Settings</h2>
                        </div>

                        <div className="space-y-4">
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="INR">INR (₹ Indian Rupee)</option>
                                <option value="USD">USD ($ US Dollar)</option>
                                <option value="EUR">EUR (€ Euro)</option>
                                <option value="GBP">GBP (£ British Pound)</option>
                            </select>

                            <input
                                type="text"
                                name="quotationPrefix"
                                value={settings.quotationPrefix}
                                onChange={handleChange}
                                placeholder="Quotation Prefix (e.g., EST, INV)"
                                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Current Configuration Summary */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Current Configuration</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Company:</span>
                                <span className="font-medium">{settings.companyName || "-"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Email:</span>
                                <span className="font-medium">{settings.companyEmail || "-"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Currency:</span>
                                <span className="font-medium">{settings.currency} ({settings.currencySymbol})</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Quotation Prefix:</span>
                                <span className="font-medium">{settings.quotationPrefix || "-"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Low Complexity:</span>
                                <span className="font-medium">{settings.currencySymbol}{settings.lowComplexityLimit?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Medium Complexity:</span>
                                <span className="font-medium">{settings.currencySymbol}{settings.mediumComplexityLimit?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-500">Tax Rate:</span>
                                <span className="font-medium">{settings.taxRate}% {settings.enableTax ? "(Enabled)" : "(Disabled)"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Settings;