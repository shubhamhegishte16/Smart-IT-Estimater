import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">

      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          Smart IT
        </h1>
      </div>

      <nav className="flex flex-col p-4 gap-2">

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/dashboard"
        >
          Dashboard
        </Link>

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/features"
        >
          Features
        </Link>

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/pricing"
        >
          Pricing
        </Link>

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/project-types"
        >
          Project Types
        </Link>

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/estimations"
        >
          Estimations
        </Link>

        <Link
          className="px-4 py-3 rounded-lg hover:bg-gray-100"
          to="/admin/settings"
        >
          Settings
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;