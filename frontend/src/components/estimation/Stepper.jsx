export default function Stepper({ step }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        marginBottom: "40px",
      }}
    >
      {["Project Type", "Features", "Details"].map((label, index) => (
        <div
          key={label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              background:
                step >= index + 1 ? "#111827" : "#E5E7EB",
              color:
                step >= index + 1 ? "#fff" : "#111827",
            }}
          >
            {index + 1}
          </div>

          <span
            style={{
              fontSize: "12px",
              color:
                step >= index + 1 ? "#111827" : "#6B7280",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}