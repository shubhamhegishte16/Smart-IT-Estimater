import AdminLayout from "../../components/admin/AdminLayout";

function Estimations() {
  const estimations = [
    {
      client: "Rahul",
      type: "Website",
      cost: "₹50000",
      complexity: "Medium",
    },
    {
      client: "Amit",
      type: "Mobile App",
      cost: "₹120000",
      complexity: "High",
    },
  ];

  return (
    <AdminLayout>

      <h1 className="text-2xl font-bold mb-6">
        Estimations
      </h1>

      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Project Type</th>
              <th className="text-left p-4">Cost</th>
              <th className="text-left p-4">Complexity</th>
            </tr>
          </thead>

          <tbody>

            {estimations.map((item, index) => (
              <tr key={index} className="border-t">

                <td className="p-4">{item.client}</td>

                <td className="p-4">{item.type}</td>

                <td className="p-4">{item.cost}</td>

                <td className="p-4">{item.complexity}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}

export default Estimations;