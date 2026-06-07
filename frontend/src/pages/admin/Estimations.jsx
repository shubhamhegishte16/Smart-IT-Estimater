import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  deleteEstimation,
  getEstimations,
} from "../../services/estimationService";
import { Trash2 } from "lucide-react";

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this estimation?")) return;

    try {
      await deleteEstimation(id);
      setEstimations((current) =>
        current.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Error deleting estimation:", error);
      alert("Failed to delete estimation");
    }
  };

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

                  <th className="text-right p-3 text-xs uppercase tracking-wider text-gray-500">
                    Actions
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

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span className="text-sm">
                          Delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}

                {estimations.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
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
