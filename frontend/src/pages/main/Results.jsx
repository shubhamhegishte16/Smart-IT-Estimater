import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  Layers,
  Wallet,
} from "lucide-react";
import MainNavbar from "../../components/main/MainNavbar";

const money = (value) => {
  return `Rs ${Number(value || 0).toLocaleString()}`;
};

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A]">
        <MainNavbar />
        <main className="mx-auto max-w-4xl px-5 py-16">
          <div className="rounded-3xl border border-[#E5E5E5] bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black">No result found</h1>
            <p className="mt-3 text-[#666666]">
              Start a new estimate to generate a project result.
            </p>
            <button
              onClick={() => navigate("/estimations")}
              className="mt-6 rounded-xl bg-[#0A0A0A] px-5 py-3 text-sm font-bold text-white"
            >
              Start Estimate
            </button>
          </div>
        </main>
      </div>
    );
  }

  const { estimate, client } = state;
  const projectType = estimate.projectType;
  const features = estimate.features || [];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0A0A0A]">
      <MainNavbar />

      <main className="mx-auto max-w-6xl px-5 py-10">
        <button
          onClick={() => navigate("/estimations")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#0A0A0A]"
        >
          <ArrowLeft size={16} />
          New estimate
        </button>

        <section className="rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 border-b border-[#E5E5E5] pb-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#666666]">
                Estimate Result
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">
                {projectType?.name || "Project Estimate"}
              </h1>
              <p className="mt-3 max-w-2xl text-[#666666]">
                {client?.clientName || "Client"} has selected {features.length} feature
                {features.length === 1 ? "" : "s"} for this build.
              </p>
            </div>

            <div className="rounded-3xl bg-[#F5F5F5] p-6 text-right">
              <p className="text-xs font-black uppercase tracking-widest text-[#555555]">
                Total Estimate
              </p>
              <h2 className="mt-2 text-4xl font-black text-[#0A0A0A]">
                {money(estimate.cost)}
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard icon={Wallet} label="Cost" value={money(estimate.cost)} />
            <InfoCard
              icon={CalendarDays}
              label="Timeline"
              value={`${estimate.days || 0} days`}
            />
            <InfoCard
              icon={Layers}
              label="Complexity"
              value={estimate.complexity || "Low"}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="rounded-3xl border border-[#E5E5E5] bg-[#FAFAFA] p-6">
              <h2 className="text-xl font-black">Selected features</h2>

              <div className="mt-5 space-y-3">
                {features.length === 0 ? (
                  <p className="text-sm text-[#666666]">No extra features selected.</p>
                ) : (
                  features.map((feature) => (
                    <div
                      key={feature._id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#E5E5E5] bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-[#0A0A0A]" size={18} />
                        <span className="font-bold">{feature.name}</span>
                      </div>
                      <span className="font-black text-[#0A0A0A]">
                        {money(feature.cost)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E5E5] bg-white p-6">
              <h2 className="text-xl font-black">Client details</h2>
              <div className="mt-5 space-y-3 text-sm">
                <SummaryLine label="Name" value={client?.clientName || "-"} />
                <SummaryLine label="Email" value={client?.clientEmail || "-"} />
                <SummaryLine label="Phone" value={client?.phone || "-"} />
                <SummaryLine label="Company" value={client?.company || "-"} />
                <SummaryLine label="Stack" value={estimate.stack || "-"} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-[#E5E5E5] pt-6">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0A0A0A] px-6 text-sm font-bold text-white transition hover:bg-black/90"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
      <Icon className="text-[#0A0A0A]" size={22} />
      <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#666666]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#FFFFFF] px-4 py-3">
      <span className="text-[#666666]">{label}</span>
      <span className="text-right font-bold text-[#0A0A0A]">{value}</span>
    </div>
  );
}

export default Results;
