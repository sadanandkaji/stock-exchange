// src/components/Topbar.tsx
import { NavLink } from "react-router-dom";

export function Topbar() {
  const linkStyle = "text-gray-600 hover:text-blue-600 transition duration-200";
  const activeStyle = "font-semibold text-blue-700 border-b-2 border-blue-700";

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-20 bg-blue-50 border-y border-gray-200 flex justify-between items-center px-10 shadow-md">
      <div className="text-3xl font-bold text-blue-700">BETx</div>

      <div className="flex gap-10 text-lg">
        <NavLink to="/" end className={({ isActive }) => isActive ? activeStyle : linkStyle}>Allevents</NavLink>
        <NavLink to="/order" className={({ isActive }) => isActive ? activeStyle : linkStyle}>Booking</NavLink>
        <NavLink to="/balance" className={({ isActive }) => isActive ? activeStyle : linkStyle}>Cricket</NavLink>
        <NavLink to="/depth" className={({ isActive }) => isActive ? activeStyle : linkStyle}>Trading</NavLink>
      </div>

      <div className="flex bg-black text-white font-semibold rounded overflow-hidden">
        <button className="px-4 py-2 border-r border-white hover:bg-gray-800 transition">Signup</button>
        <button className="px-4 py-2 hover:bg-gray-800 transition">Signin</button>
      </div>
    </div>
  );
}
