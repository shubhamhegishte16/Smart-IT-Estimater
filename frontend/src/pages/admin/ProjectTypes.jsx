import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getProjectTypes } from "../../services/projectTypeService";

function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const data = await getProjectTypes();
        setProjectTypes(data);
      } catch (error) {
        console.error("Error fetching project types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectTypes();
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Project Types
        </h1>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Type
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            Loading Project Types...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">
                  Name
                </th>

                <th className="text-left p-4 font-semibold">
                  Base Cost
                </th>

                <th className="text-left p-4 font-semibold">
                  Base Days
                </th>

                <th className="text-left p-4 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {projectTypes.map((type) => (
                <tr
                  key={type._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    {type.name}
                  </td>

                  <td className="p-4">
                    ₹{type.baseCost.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {type.baseDays} Days
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

              {projectTypes.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    No Project Types Found
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

export default ProjectTypes;