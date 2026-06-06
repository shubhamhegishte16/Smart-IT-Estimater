import LiveEstimateCard from "./LiveEstimateCard";

export default function FeaturesStep({
  features,
  selectedFeatures,
  toggleFeature,
  cost,
  complexity,
  onBack,
  onContinue,
}) {
  return (
    <>
      <LiveEstimateCard
        cost={cost}
        complexity={complexity}
        featureCount={selectedFeatures.length}
      />

      <h2 style={{ marginBottom: 20 }}>
        Select Features
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature}
            onClick={() => toggleFeature(feature)}
            style={{
              padding: "18px",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              background:
                selectedFeatures.includes(feature)
                  ? "#111827"
                  : "#F3F4F6",
              color:
                selectedFeatures.includes(feature)
                  ? "#fff"
                  : "#111827",
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 25,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "#E5E7EB",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <button
          onClick={onContinue}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Continue →
        </button>
      </div>
    </>
  );
}