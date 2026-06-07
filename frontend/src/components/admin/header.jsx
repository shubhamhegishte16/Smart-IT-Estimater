import React from 'react';

function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-[#fbf9f4] px-8 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
}

export default Header;