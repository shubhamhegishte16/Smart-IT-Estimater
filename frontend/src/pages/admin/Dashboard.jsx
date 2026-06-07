import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
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
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: "TOTAL FEATURES",
      value: stats.totalFeatures,
    },
    {
      title: "PROJECT TYPES",
      value: stats.totalProjectTypes,
    },
    {
      title: "ESTIMATIONS",
      value: 0,
    },
    {
      title: "UNIQUE CLIENTS",
      value: 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="w-full">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            A snapshot of your estimation pipeline.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl border border-gray-200 p-7"
            >
              <p className="text-sm font-medium text-gray-500 uppercase mb-4">
                {card.title}
              </p>

              <h2 className="text-5xl font-bold text-slate-900">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Estimations */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 min-h-[250px]">

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold uppercase">
                Recent Estimations
              </h2>

              <button className="text-sm font-medium hover:underline">
                View all
              </button>
            </div>

            <p className="text-gray-500 text-lg">
              No estimations yet.
            </p>
          </div>

          {/* Pipeline Value */}
          <div className="bg-black text-white shadow-sm text-white rounded-3xl p-8 min-h-[190px] flex flex-col justify-start">

            <p className="uppercase text-sm tracking-wide">
              Pipeline Value (Avg)
            </p>

            <h2 className="text-6xl font-bold mt-3">
              $0
            </h2>

            <p className="mt-8 text-xl leading-relaxed text-emerald-50">
              Total midpoint value across all saved
              estimations.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;