import Sidebar from "./sidebar";
import Header from "./header";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#F7F6F1] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-12 py-10 bg-[#F7F6F1]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
