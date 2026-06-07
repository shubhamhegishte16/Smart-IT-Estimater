import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getEstimations } from "../../services/estimationService";

function Estimations() {
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstimations = async () => {
      try {
        const data = await getEstimations();
        setEstimations(data);
      } catch (error) {
        console.error(
          "Error fetching estimations:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEstimations();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Estimations
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View and manage all generated project estimations.
          </p>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading estimations...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Client
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Project Type
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Cost
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Days
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Complexity
                  </th>
                </tr>
              </thead>

              <tbody>
                {estimations.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {item.clientName}
                    </td>

                    <td className="p-3 text-slate-700">
                      {item.clientEmail}
                    </td>

                    <td className="p-3 text-slate-700">
                      {item.projectType?.name}
                    </td>

                    <td className="p-3 text-slate-700">
                      ₹{item.totalCost?.toLocaleString()}
                    </td>

                    <td className="p-3 text-slate-700">
                      {item.totalDays} Days
                    </td>

                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {item.complexity}
                      </span>
                    </td>
                  </tr>
                ))}

                {estimations.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500"
                    >
                      No Estimations Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Estimations;