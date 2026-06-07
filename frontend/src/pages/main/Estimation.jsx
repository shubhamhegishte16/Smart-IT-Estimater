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
} from "lucide-react";
import MainNavbar from "../../components/main/MainNavbar";
import { getFeatures } from "../../services/featureService";
import { getProjectTypes } from "../../services/projectTypeService";
import { createEstimation } from "../../services/estimationService";

const steps = ["Project Type", "Features", "Client Details"];

const iconPool = [Globe2, LayoutGrid, Sparkles];

const money = (value) => {
  return `Rs ${Number(value || 0).toLocaleString()}`;
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
      });

      navigate("/results", {
        state: {
          estimate: {
            ...estimate,
            id: savedEstimate._id,
            stack: savedEstimate.recommendedStack?.join(" + ") || "React + Node.js + MongoDB",
            features: selectedFeatureObjects,
            projectType: selectedProjectType,
          },
          client,
        },
      });
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save this estimate.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A]">
      <MainNavbar />

      <main className="mx-auto max-w-7xl px-5 py-10">
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
      </main>
    </div>
  );
}

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
