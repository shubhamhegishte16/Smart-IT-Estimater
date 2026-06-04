import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";

function Dashboard() {

  const stats = [
    { title: "Features", value: 20 },
    { title: "Project Types", value: 5 },
    { title: "Estimations", value: 0 },
    { title: "Clients", value: 0 },
  ];

  return (
    <AdminLayout>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">

        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}

      </div>

    </AdminLayout>
  );
}

export default Dashboard;