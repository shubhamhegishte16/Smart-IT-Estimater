export default function ClientDetailsStep({
  data,
  setData,
  cost,
  complexity,
  onBack,
  onGenerate,
}) {
  return (
    <>
      <h2 style={{ marginBottom: 20 }}>
        Client Details
      </h2>

      <input
        placeholder="Full Name"
        value={data.clientName}
        onChange={(e) =>
          setData({
            ...data,
            clientName: e.target.value,
          })
        }
        style={inputStyle}
      />

      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({
            ...data,
            email: e.target.value,
          })
        }
        style={inputStyle}
      />

      <input
        placeholder="Phone"
        value={data.phone}
        onChange={(e) =>
          setData({
            ...data,
            phone: e.target.value,
          })
        }
        style={inputStyle}
      />

      <input
        placeholder="Company"
        value={data.company}
        onChange={(e) =>
          setData({
            ...data,
            company: e.target.value,
          })
        }
        style={inputStyle}
      />

      <div
        style={{
          marginTop: 20,
          padding: 20,
          background: "#F3F4F6",
          borderRadius: 12,
        }}
      >
        <h3>Estimate Preview</h3>

        <p>
          <b>Project:</b> {data.projectType}
        </p>

        <p>
          <b>Features:</b> {data.features.length}
        </p>

        <p>
          <b>Complexity:</b> {complexity}
        </p>

        <p>
          <b>Cost:</b> ₹{cost.toLocaleString()}
        </p>
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
          onClick={onGenerate}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Generate Estimate →
        </button>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #D1D5DB",
  borderRadius: "8px",
  boxSizing: "border-box",
};