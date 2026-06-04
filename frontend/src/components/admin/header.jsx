function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <h2 className="font-semibold text-lg">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500"></div>
      </div>

    </header>
  );
}

export default Header;