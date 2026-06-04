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
      <h1 className="text-2xl font-bold mb-6">
        Estimations
      </h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6">
            Loading Estimations...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">
                  Client
                </th>

                <th className="text-left p-4">
                  Email
                </th>

                <th className="text-left p-4">
                  Project Type
                </th>

                <th className="text-left p-4">
                  Cost
                </th>

                <th className="text-left p-4">
                  Days
                </th>

                <th className="text-left p-4">
                  Complexity
                </th>
              </tr>
            </thead>

            <tbody>
              {estimations.map((item) => (
                <tr
                  key={item._id}
                  className="border-t"
                >
                  <td className="p-4">
                    {item.clientName}
                  </td>

                  <td className="p-4">
                    {item.clientEmail}
                  </td>

                  <td className="p-4">
                    {item.projectType?.name}
                  </td>

                  <td className="p-4">
                    ₹{item.totalCost?.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {item.totalDays} Days
                  </td>

                  <td className="p-4">
                    {item.complexity}
                  </td>
                </tr>
              ))}

              {estimations.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No Estimations Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

export default Estimations;