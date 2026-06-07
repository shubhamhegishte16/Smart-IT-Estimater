import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getProjectTypes } from "../../services/projectTypeService";
import { Pencil, Trash2, Plus } from "lucide-react";

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
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Project Types
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage project categories, base costs, and delivery timelines.
            </p>
          </div>

          <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Add Type
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading project types...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Name
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Base Cost
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Base Days
                  </th>

                  <th className="text-right p-3 text-xs uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {projectTypes.map((type) => (
                  <tr
                    key={type._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {type.name}
                    </td>

                    <td className="p-3 text-slate-700">
                      ₹{type.baseCost.toLocaleString()}
                    </td>

                    <td className="p-3 text-slate-700">
                      {type.baseDays} Days
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-4">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors">
                          <Pencil size={16} />
                          <span className="text-sm">
                            Edit
                          </span>
                        </button>

                        <button className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={16} />
                          <span className="text-sm">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {projectTypes.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-10 text-center text-gray-500"
                    >
                      No Project Types Found
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

export default ProjectTypes;