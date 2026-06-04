import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import { getDashboardOverview } from "../../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalFeatures: 0,
    totalProjectTypes: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardOverview();
        setStats(data);
      } catch (error) {
        console.error(
          "Error fetching dashboard data:",
          error
        );
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: "Features",
      value: stats.totalFeatures,
    },
    {
      title: "Project Types",
      value: stats.totalProjectTypes,
    },
    {
      title: "Estimations",
      value: 0,
    },
    {
      title: "Clients",
      value: 0,
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {dashboardCards.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;