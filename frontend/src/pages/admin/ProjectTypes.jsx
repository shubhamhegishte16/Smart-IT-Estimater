import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  createProjectType,
  deleteProjectType,
  getProjectTypes,
  updateProjectType,
} from "../../services/projectTypeService";
import { Pencil, Trash2, Plus } from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  baseCost: 0,
  baseDays: 0,
};

function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(emptyForm);

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

  useEffect(() => {
    fetchProjectTypes();
  }, []);

  const updateField = (event) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const openAddForm = () => {
    setEditingId("");
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (type) => {
    setEditingId(type._id);
    setFormData({
      name: type.name || "",
      description: type.description || "",
      baseCost: type.baseCost || 0,
      baseDays: type.baseDays || 0,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId("");
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        const updated = await updateProjectType(editingId, formData);
        setProjectTypes((current) =>
          current.map((type) =>
            type._id === updated._id ? updated : type
          )
        );
      } else {
        const created = await createProjectType(formData);
        setProjectTypes((current) => [...current, created]);
      }

      closeForm();
    } catch (error) {
      console.error("Error saving project type:", error);
      alert("Failed to save project type");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project type?")) return;

    try {
      await deleteProjectType(id);
      setProjectTypes((current) =>
        current.filter((type) => type._id !== id)
      );
    } catch (error) {
      console.error("Error deleting project type:", error);
      alert("Failed to delete project type");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Project Types
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage project categories, base costs, and delivery timelines.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Type
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white rounded-2xl border border-gray-200 p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 xl:items-end"
          >
            <input
              name="name"
              value={formData.name}
              onChange={updateField}
              placeholder="Name"
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              name="description"
              value={formData.description}
              onChange={updateField}
              placeholder="Description"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="number"
              name="baseCost"
              min="0"
              value={formData.baseCost}
              onChange={updateField}
              placeholder="Base Cost"
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="number"
              name="baseDays"
              min="0"
              value={formData.baseDays}
              onChange={updateField}
              placeholder="Base Days"
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex gap-2">
              <button className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium">
                {editingId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="border border-gray-300 px-4 py-3 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

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
                      Rs {Number(type.baseCost || 0).toLocaleString()}
                    </td>

                    <td className="p-3 text-slate-700">
                      {type.baseDays} Days
                    </td>

                    <td className="p-3">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => openEditForm(type)}
                          className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors"
                        >
                          <Pencil size={16} />
                          <span className="text-sm">
                            Edit
                          </span>
                        </button>

                        <button
                          onClick={() => handleDelete(type._id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                        >
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
