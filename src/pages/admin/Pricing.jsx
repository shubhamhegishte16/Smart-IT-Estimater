import AdminLayout from "../../components/admin/AdminLayout";

function Pricing() {
  const pricing = [
    {
      feature: "Authentication",
      cost: "₹5000",
    },
    {
      feature: "Payment Gateway",
      cost: "₹8000",
    },
    {
      feature: "AI Chatbot",
      cost: "₹20000",
    },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">
        Pricing Management
      </h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4">Feature</th>
              <th className="text-left p-4">Current Cost</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {pricing.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-4">{item.feature}</td>
                <td className="p-4">{item.cost}</td>
                <td className="p-4">
                  <button className="text-blue-600">
                    Update
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

export default Pricing;