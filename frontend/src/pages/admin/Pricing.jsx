import AdminLayout from "../../components/admin/AdminLayout";
import { Pencil } from "lucide-react";

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
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Pricing Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage feature pricing and project cost estimates.
            </p>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
              {pricing.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium text-slate-900">
                    {item.feature}
                  </td>

                  <td className="p-3 text-slate-700">
                    {item.cost}
                  </td>

                  <td className="p-3 text-right">
                    <button className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                      <Pencil size={16} />
                      <span className="text-sm">
                        Update
                      </span>
                    </button>
                  </td>
                </tr>
              ))}

              {pricing.length === 0 && (
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
        </div>
      </div>
    </AdminLayout>
  );
}

export default Pricing;