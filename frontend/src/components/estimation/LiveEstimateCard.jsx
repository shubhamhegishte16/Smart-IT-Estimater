export default function LiveEstimateCard({
  cost,
  complexity,
  featureCount,
}) {
  return (
    <div
      style={{
        background: "#111827",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "25px",
      }}
    >
      <h4>Live Estimate</h4>

      <h2>₹{cost.toLocaleString()}</h2>

      <p>{featureCount} Features Selected</p>

      <p>{complexity} Complexity</p>
    </div>
  );
}