export default function ProjectTypeStep({
  projectTypes,
  selectedType,
  setProjectType,
  onContinue,
}) {
  return (
    <>
      <h2 style={{ marginBottom: 20 }}>
        Select Project Type
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
        }}
      >
        {projectTypes.map((type) => (
          <div
            key={type}
            onClick={() => setProjectType(type)}
            style={{
              padding: "18px",
              borderRadius: "12px",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "600",
              background:
                selectedType === type
                  ? "#111827"
                  : "#F3F4F6",
              color:
                selectedType === type
                  ? "#fff"
                  : "#111827",
            }}
          >
            {type}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 25,
        }}
      >
        <button
          disabled={!selectedType}
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