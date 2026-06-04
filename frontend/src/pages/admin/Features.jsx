import AdminLayout from "../../components/admin/AdminLayout";

function Features() {
  const features = [
    {
      name: "Authentication",
      cost: 15000,
      time: 3,
      complexity: 5,
    },
    {
      name: "Admin Panel",
      cost: 25000,
      time: 5,
      complexity: 8,
    },
    {
      name: "Database Integration",
      cost: 20000,
      time: 4,
      complexity: 6,
    },
    {
      name: "Payment Gateway",
      cost: 20000,
      time: 4,
      complexity: 7,
    },
    {
      name: "API Integration",
      cost: 15000,
      time: 3,
      complexity: 5,
    },
    {
      name: "AI Features",
      cost: 50000,
      time: 10,
      complexity: 15,
    },
    {
      name: "Real-time Chat",
      cost: 30000,
      time: 6,
      complexity: 10,
    },
    {
      name: "Analytics Dashboard",
      cost: 25000,
      time: 5,
      complexity: 8,
    },
  ];

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
                Time
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
            {features.map((feature, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  {feature.name}
                </td>

                <td className="p-4">
                  ₹{feature.cost.toLocaleString()}
                </td>

                <td className="p-4">
                  {feature.time} Days
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
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Features;