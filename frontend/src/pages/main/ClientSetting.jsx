import { useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import ClientHubLayout from "../../components/main/ClientHubLayout";

const currencyOptions = ["INR", "USD", "EUR", "GBP"];
const timezoneOptions = ["UTC -5:00", "UTC +0:00", "UTC +5:30", "UTC +1:00"];
const languageOptions = ["English", "Spanish", "French", "German"];
const dateFormats = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

const initialPersonal = {
  fullName: "Maya Patel",
  company: "Lumenix Technologies",
  email: "maya.patel@lumenix.io",
  phone: "+1 (415) 555-0198",
  website: "https://lumenix.io",
  industry: "Fintech",
  address: "295 Mission Street, San Francisco, CA 94105",
};

const initialNotifications = {
  email: true,
  sms: false,
  approvals: true,
  messages: true,
  productUpdates: true,
  marketing: false,
};

export default function ClientSetting() {
  const [personal, setPersonal] = useState(initialPersonal);
  const [security, setSecurity] = useState({
    password: "",
    confirmPassword: "",
    twoFactor: true,
  });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [regional, setRegional] = useState({
    currency: "USD",
    timezone: "UTC -5:00",
    language: "English",
    dateFormat: "DD/MM/YYYY",
  });
  const [preferences, setPreferences] = useState({
    defaultProjectType: "SaaS Platform",
    defaultTechStack: "React + Node.js",
    autoSave: true,
    autoGeneratePDF: false,
  });

  const handleReset = () => {
    setPersonal(initialPersonal);
    setSecurity({ password: "", confirmPassword: "", twoFactor: true });
    setNotifications(initialNotifications);
    setRegional({
      currency: "USD",
      timezone: "UTC -5:00",
      language: "English",
      dateFormat: "DD/MM/YYYY",
    });
    setPreferences({
      defaultProjectType: "SaaS Platform",
      defaultTechStack: "React + Node.js",
      autoSave: true,
      autoGeneratePDF: false,
    });
  };

  return (
    <ClientHubLayout activeItem="Settings" showProfileActions>
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Account settings
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              Account Settings
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Manage your account preferences, security, notifications, and personalization options.
            </p>
          </div>
          <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto">
            <button className="h-12 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Save All Settings
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Reset Preferences
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <div className="space-y-6">
          <SettingsPanel
            icon={User}
            title="Personal information"
            description="Update your core profile details and contact preferences."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full Name", value: personal.fullName, key: "fullName", icon: User },
                { label: "Company Name", value: personal.company, key: "company", icon: Building2 },
                { label: "Email Address", value: personal.email, key: "email", icon: Mail },
                { label: "Phone Number", value: personal.phone, key: "phone", icon: Phone },
                { label: "Website", value: personal.website, key: "website", icon: Globe2 },
                { label: "Industry", value: personal.industry, key: "industry", icon: Sparkles },
                { label: "Address", value: personal.address, key: "address", icon: MapPin },
              ].map((field) => (
                <label
                  key={field.key}
                  className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition focus-within:border-slate-400"
                >
                  <div className="flex items-center gap-3 text-slate-500">
                    <field.icon className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.24em]">
                      {field.label}
                    </span>
                  </div>
                  <input
                    value={field.value}
                    onChange={(event) =>
                      setPersonal((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="mt-3 w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </label>
              ))}
            </div>
          </SettingsPanel>

          <SettingsPanel
            icon={Lock}
            title="Security settings"
            description="Keep your account secure with password and session controls."
          >
            <div className="grid gap-4">
              <PasswordInput
                label="Change Password"
                value={security.password}
                onChange={(value) => setSecurity((current) => ({ ...current, password: value }))}
                placeholder="New password"
              />
              <PasswordInput
                label="Confirm New Password"
                value={security.confirmPassword}
                onChange={(value) =>
                  setSecurity((current) => ({ ...current, confirmPassword: value }))
                }
                placeholder="Confirm password"
              />
              <ToggleRow
                label="Enable Two-Factor Authentication"
                description="Add extra protection for your account sign-ins."
                checked={security.twoFactor}
                onChange={() =>
                  setSecurity((current) => ({ ...current, twoFactor: !current.twoFactor }))
                }
              />
            </div>
          </SettingsPanel>
        </div>

        <div className="space-y-6">
          <SettingsPanel
            icon={Bell}
            title="Notifications"
            description="Choose the alerts you want to receive."
          >
            <div className="grid gap-3">
              {[
                ["email", "Email alerts"],
                ["sms", "SMS alerts"],
                ["approvals", "Approval updates"],
                ["messages", "Admin messages"],
                ["productUpdates", "Product updates"],
                ["marketing", "Marketing emails"],
              ].map(([key, label]) => (
                <ToggleRow
                  key={key}
                  label={label}
                  checked={notifications[key]}
                  onChange={() =>
                    setNotifications((current) => ({ ...current, [key]: !current[key] }))
                  }
                />
              ))}
            </div>
          </SettingsPanel>

          <SettingsPanel
            icon={Globe2}
            title="Regional preferences"
            description="Set formats used across your estimates and documents."
          >
            <div className="grid gap-4">
              <SelectField
                label="Currency"
                value={regional.currency}
                options={currencyOptions}
                onChange={(value) => setRegional((current) => ({ ...current, currency: value }))}
              />
              <SelectField
                label="Timezone"
                value={regional.timezone}
                options={timezoneOptions}
                onChange={(value) => setRegional((current) => ({ ...current, timezone: value }))}
              />
              <SelectField
                label="Language"
                value={regional.language}
                options={languageOptions}
                onChange={(value) => setRegional((current) => ({ ...current, language: value }))}
              />
              <SelectField
                label="Date Format"
                value={regional.dateFormat}
                options={dateFormats}
                onChange={(value) => setRegional((current) => ({ ...current, dateFormat: value }))}
              />
            </div>
          </SettingsPanel>

          <SettingsPanel
            icon={CheckCircle2}
            title="Estimate preferences"
            description="Tune defaults for new client estimations."
          >
            <div className="grid gap-3">
              <TextField
                label="Default Project Type"
                value={preferences.defaultProjectType}
                onChange={(value) =>
                  setPreferences((current) => ({ ...current, defaultProjectType: value }))
                }
              />
              <TextField
                label="Default Tech Stack"
                value={preferences.defaultTechStack}
                onChange={(value) =>
                  setPreferences((current) => ({ ...current, defaultTechStack: value }))
                }
              />
              <ToggleRow
                label="Auto-save estimates"
                checked={preferences.autoSave}
                onChange={() =>
                  setPreferences((current) => ({ ...current, autoSave: !current.autoSave }))
                }
              />
              <ToggleRow
                label="Auto-generate PDF"
                checked={preferences.autoGeneratePDF}
                onChange={() =>
                  setPreferences((current) => ({
                    ...current,
                    autoGeneratePDF: !current.autoGeneratePDF,
                  }))
                }
              />
            </div>
          </SettingsPanel>
        </div>
      </div>
    </ClientHubLayout>
  );
}

function SettingsPanel({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-3 w-full bg-transparent text-sm text-slate-900 outline-none"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
      />
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-700">{label}</p>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onChange}
          className={`h-11 w-20 rounded-full transition ${
            checked ? "bg-slate-900" : "bg-slate-300"
          }`}
          aria-pressed={checked}
        >
          <span
            className={`block h-9 w-9 rounded-full bg-white transition ${
              checked ? "translate-x-10" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
