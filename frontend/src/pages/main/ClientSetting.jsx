import { useState, useEffect } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  User,
  Loader,
} from "lucide-react";
import ClientHubLayout from "../../components/main/ClientHubLayout";

const currencyOptions = ["INR", "USD", "EUR", "GBP"];
const timezoneOptions = ["UTC -5:00", "UTC +0:00", "UTC +5:30", "UTC +1:00"];
const languageOptions = ["English", "Spanish", "French", "German"];
const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

export default function ClientSetting() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "client@example.com";

  const [personal, setPersonal] = useState({
    fullName: user.name || "",
    company: user.company || "",
    email: userEmail,
    phone: user.phone || "",
    website: "",
    industry: "",
    address: "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    approvals: true,
    messages: true,
    productUpdates: true,
    marketing: false,
  });

  const [regional, setRegional] = useState({
    currency: "USD",
    timezone: "UTC +5:30",
    language: "English",
    dateFormat: "DD/MM/YYYY",
  });

  const [preferences, setPreferences] = useState({
    defaultProjectType: "",
    defaultTechStack: "",
    autoSave: true,
    autoGeneratePDF: false,
  });

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("clientSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.personal) setPersonal(settings.personal);
        if (settings.notifications) setNotifications(settings.notifications);
        if (settings.regional) setRegional(settings.regional);
        if (settings.preferences) setPreferences(settings.preferences);
        if (settings.twoFactor !== undefined) {
          setSecurity(prev => ({ ...prev, twoFactor: settings.twoFactor }));
        }
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const saveAllSettings = () => {
    setSaving(true);
    
    const allSettings = {
      personal,
      notifications,
      regional,
      preferences,
      twoFactor: security.twoFactor
    };
    localStorage.setItem("clientSettings", JSON.stringify(allSettings));
    
    // Update user in localStorage
    const updatedUser = { ...user, name: personal.fullName, company: personal.company, phone: personal.phone };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setMessage({ type: "success", text: "Settings saved successfully!" });
    setTimeout(() => setMessage(null), 3000);
    setSaving(false);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      setPersonal({
        fullName: user.name || "",
        company: user.company || "",
        email: userEmail,
        phone: user.phone || "",
        website: "",
        industry: "",
        address: "",
      });
      setNotifications({
        email: true, sms: false, approvals: true, messages: true, productUpdates: true, marketing: false
      });
      setRegional({
        currency: "USD", timezone: "UTC +5:30", language: "English", dateFormat: "DD/MM/YYYY"
      });
      setPreferences({
        defaultProjectType: "", defaultTechStack: "", autoSave: true, autoGeneratePDF: false
      });
      setSecurity(prev => ({ ...prev, twoFactor: false }));
      
      setMessage({ type: "success", text: "Settings reset to default" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleChangePassword = () => {
    if (security.newPassword !== security.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (security.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters!" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    
    setMessage({ type: "success", text: "Password changed successfully!" });
    setSecurity(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <ClientHubLayout activeItem="Settings" showProfileActions>
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading settings...</p>
          </div>
        </div>
      </ClientHubLayout>
    );
  }

  return (
    <ClientHubLayout activeItem="Settings" showProfileActions>
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Account settings</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight">Account Settings</h1>
            <p className="mt-4 text-sm text-slate-600">Manage your account preferences and personalization options.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={saveAllSettings} disabled={saving} className="h-12 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white flex items-center gap-2">
              {saving && <Loader className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save All Settings"}
            </button>
            <button onClick={handleReset} className="h-12 rounded-2xl border border-slate-200 px-5 text-sm font-semibold">
              Reset
            </button>
          </div>
        </div>
        {message && (
          <div className={`mt-4 p-4 rounded-2xl ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-black mb-4">Personal Information</h2>
          <div className="space-y-4">
            <input value={personal.fullName} onChange={e => setPersonal({...personal, fullName: e.target.value})} placeholder="Full Name" className="w-full p-3 rounded-xl border" />
            <input value={personal.company} onChange={e => setPersonal({...personal, company: e.target.value})} placeholder="Company" className="w-full p-3 rounded-xl border" />
            <input value={personal.email} disabled className="w-full p-3 rounded-xl border bg-gray-50" />
            <input value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} placeholder="Phone" className="w-full p-3 rounded-xl border" />
            <input value={personal.website} onChange={e => setPersonal({...personal, website: e.target.value})} placeholder="Website" className="w-full p-3 rounded-xl border" />
            <input value={personal.address} onChange={e => setPersonal({...personal, address: e.target.value})} placeholder="Address" className="w-full p-3 rounded-xl border" />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-black mb-4">Security</h2>
          <div className="space-y-4">
            <input type="password" value={security.currentPassword} onChange={e => setSecurity({...security, currentPassword: e.target.value})} placeholder="Current Password" className="w-full p-3 rounded-xl border" />
            <input type="password" value={security.newPassword} onChange={e => setSecurity({...security, newPassword: e.target.value})} placeholder="New Password" className="w-full p-3 rounded-xl border" />
            <input type="password" value={security.confirmPassword} onChange={e => setSecurity({...security, confirmPassword: e.target.value})} placeholder="Confirm Password" className="w-full p-3 rounded-xl border" />
            <button onClick={handleChangePassword} className="w-full p-3 rounded-xl bg-slate-900 text-white">Change Password</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-black mb-4">Notifications</h2>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex justify-between items-center p-3 rounded-xl border cursor-pointer">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <input type="checkbox" checked={value} onChange={() => setNotifications({...notifications, [key]: !value})} className="w-5 h-5" />
              </label>
            ))}
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-black mb-4">Regional Settings</h2>
          <div className="space-y-4">
            <select value={regional.currency} onChange={e => setRegional({...regional, currency: e.target.value})} className="w-full p-3 rounded-xl border">
              {currencyOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select value={regional.timezone} onChange={e => setRegional({...regional, timezone: e.target.value})} className="w-full p-3 rounded-xl border">
              {timezoneOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
            <select value={regional.language} onChange={e => setRegional({...regional, language: e.target.value})} className="w-full p-3 rounded-xl border">
              {languageOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
    </ClientHubLayout>
  );
}