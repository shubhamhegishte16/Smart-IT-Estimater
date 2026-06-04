import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getFeatures } from "../../services/featureService";

function Features() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const data = await getFeatures();
        setFeatures(data);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Features
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Feature
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            Loading Features...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">
                  Name
                </th>

                <th className="text-left p-4 font-semibold">
                  Cost
                </th>

                <th className="text-left p-4 font-semibold">
                  Days
                </th>

                <th className="text-left p-4 font-semibold">
                  Complexity
                </th>

                <th className="text-left p-4 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {features.map((feature) => (
                <tr
                  key={feature._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {feature.name}
                  </td>

                  <td className="p-4">
                    ₹{feature.cost.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {feature.days} Days
                  </td>

                  <td className="p-4">
                    {feature.complexity}
                  </td>

                  <td className="p-4">
                    <button className="text-blue-600 mr-4 hover:underline">
                      Edit
                    </button>

                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {features.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500"
                  >
                    No Features Found
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

export default Features;