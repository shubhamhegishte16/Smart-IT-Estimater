import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { getDashboardOverview } from "../../services/dashboardService";
import { getEstimations } from "../../services/estimationService";

const formatMoney = (value) => {
  return `Rs ${Number(value || 0).toLocaleString()}`;
};

function Dashboard() {
  const [stats, setStats] = useState({
    totalFeatures: 0,
    totalProjectTypes: 0,
    totalEstimations: 0,
    totalClients: 0,
  });
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overview, estimationData] = await Promise.all([
          getDashboardOverview(),
          getEstimations(),
        ]);

        setStats(overview);
        setEstimations(estimationData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
      value: stats.totalEstimations,
    },
    {
      title: "UNIQUE CLIENTS",
      value: stats.totalClients,
    },
  ];

  const recentEstimations = estimations.slice(0, 5);
  const pipelineValue = estimations.reduce(
    (total, item) => total + Number(item.totalCost || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            A snapshot of your estimation pipeline.
          </p>
        </div>

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
                {loading ? "..." : card.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 p-8 min-h-[250px]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold uppercase">
                Recent Estimations
              </h2>

              <Link
                to="/admin/estimations"
                className="text-sm font-medium hover:underline"
              >
                View all
              </Link>
            </div>

            {recentEstimations.length === 0 ? (
              <p className="text-gray-500 text-lg">
                No estimations yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentEstimations.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.clientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.projectType?.name || "Project"} · {item.complexity}
                      </p>
                    </div>

                    <p className="font-semibold text-slate-900">
                      {formatMoney(item.totalCost)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-black text-white shadow-sm rounded-3xl p-8 min-h-[190px] flex flex-col justify-start">
            <p className="uppercase text-sm tracking-wide">
              Pipeline Value
            </p>

            <h2 className="text-5xl font-bold mt-3">
              {formatMoney(pipelineValue)}
            </h2>

            <p className="mt-8 text-xl leading-relaxed text-emerald-50">
              Total value across all saved estimations.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
