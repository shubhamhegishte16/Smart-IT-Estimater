import AdminLayout from "../../components/admin/AdminLayout";

function ProjectTypes() {
  const projectTypes = [
    {
      name: "Website",
      baseCost: 20000,
      baseDays: 7,
    },
    {
      name: "Web Application",
      baseCost: 50000,
      baseDays: 15,
    },
    {
      name: "Mobile App",
      baseCost: 70000,
      baseDays: 20,
    },
    {
      name: "E-Commerce",
      baseCost: 80000,
      baseDays: 25,
    },
    {
      name: "Custom Software",
      baseCost: 100000,
      baseDays: 30,
    },
  ];

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
            {projectTypes.map((type, index) => (
              <tr
                key={index}
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
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default ProjectTypes;