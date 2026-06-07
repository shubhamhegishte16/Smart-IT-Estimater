import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getFeatures, updateFeature } from "../../services/featureService";
import { Pencil } from "lucide-react";

const emptyEdit = {
  id: "",
  name: "",
  cost: 0,
};

function Pricing() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(emptyEdit);

  const fetchPricing = async () => {
    try {
      const data = await getFeatures();
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const openEdit = (feature) => {
    setEditing({
      id: feature._id,
      name: feature.name,
      cost: feature.cost || 0,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const currentFeature = features.find(
      (feature) => feature._id === editing.id
    );

    if (!currentFeature) return;

    try {
      const updated = await updateFeature(editing.id, {
        ...currentFeature,
        cost: Number(editing.cost),
      });

      setFeatures((current) =>
        current.map((feature) =>
          feature._id === updated._id ? updated : feature
        )
      );
      setEditing(emptyEdit);
    } catch (error) {
      console.error("Error updating price:", error);
      alert("Failed to update price");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Pricing Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage feature pricing used in estimates.
            </p>
          </div>
        </div>

        {editing.id && (
          <form
            onSubmit={handleSave}
            className="mb-6 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row gap-3 md:items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Feature
              </label>
              <input
                value={editing.name}
                disabled
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Cost
              </label>
              <input
                type="number"
                min="0"
                value={editing.cost}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    cost: event.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button className="bg-black hover:bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium">
              Save Price
            </button>
            <button
              type="button"
              onClick={() => setEditing(emptyEdit)}
              className="border border-gray-300 px-4 py-3 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading pricing...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Feature
                  </th>

                  <th className="text-left p-3 text-xs uppercase tracking-wider text-gray-500">
                    Current Cost
                  </th>

                  <th className="text-right p-3 text-xs uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {features.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900">
                      {item.name}
                    </td>

                    <td className="p-3 text-slate-700">
                      Rs {Number(item.cost || 0).toLocaleString()}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                      >
                        <Pencil size={16} />
                        <span className="text-sm">
                          Update
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}

                {features.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-10 text-center text-gray-500"
                    >
                      No pricing records found.
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

export default Pricing;
