import { useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No Data Found</h2>
        <button onClick={() => navigate("/estimations")}>
          Go Back
        </button>
      </div>
    );
  }

  const { estimate, data } = state;

  const COLORS = ["#000", "#888"];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>📊 Project Estimate Dashboard</h2>

        {/* SUMMARY */}
        <div style={styles.grid}>
          <div style={styles.box}>💰 ₹{estimate.cost}</div>
          <div style={styles.box}>⏱ {estimate.time} Days</div>
          <div style={styles.box}>⚡ {estimate.complexity}</div>
          <div style={styles.box}>{estimate.stack}</div>
        </div>

        {/* PIE */}
        <h3>Cost Breakdown</h3>
        <PieChart width={300} height={200}>
          <Pie
            data={estimate.breakdown}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
          >
            {estimate.breakdown.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* BAR */}
        <h3>Timeline</h3>
        <BarChart width={400} height={200} data={estimate.timeline}>
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="days" fill="#000" />
        </BarChart>

        <button onClick={() => navigate("/estimations")} style={styles.btn}>
          New Estimate
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "700px",
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  box: {
    padding: 15,
    background: "#f5f5f5",
    borderRadius: 8,
    textAlign: "center",
  },
  btn: {
    marginTop: 20,
    padding: "10px 15px",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};