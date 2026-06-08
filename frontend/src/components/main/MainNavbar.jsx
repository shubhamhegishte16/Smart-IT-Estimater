import { Link } from "react-router-dom";
import beaconLogo from "../../assets/beacon-logo.png";
function MainNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <img
  src={beaconLogo}
  alt="Beacon Logo"
  className="h-10 w-10 object-contain"
/>
          <span className="text-xl font-black tracking-tight text-[#0A0A0A]">
            Beacon
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-[#55635C]">
          <Link className="hover:text-[#0A0A0A]" to="/">
            Home
          </Link>
          <Link className="hover:text-[#0A0A0A]" to="/estimations">
            Estimate
          </Link>
          <Link className="hover:text-[#0A0A0A]" to="/results">
            Result
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default MainNavbar;
