import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="navbar bg-gradient-to-r from-[#4F46E5] to-[#6366F1] shadow-lg">
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl font-bold text-white">DevTinder</a>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">
            Hey, {user.user.firstName}! 👋
          </h2>

          {/* Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:shadow-xl transition-transform transform hover:scale-105 duration-200"
            >
              <div className="w-10 rounded-full overflow-hidden border-2 border-white">
                <img
                  alt="User photo"
                  src={user.user.photoURL}
                  className="object-cover"
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-lg bg-gray-900 text-white shadow-xl border border-gray-700"
            >
              <li>
                <a className="flex justify-between hover:bg-gray-800 px-4 py-2 rounded font-medium transition-all">
                  Profile{" "}
                  <span className="badge bg-indigo-500 text-white">New</span>
                </a>
              </li>
              <li>
                <a className="hover:bg-gray-800 px-4 py-2 rounded font-medium transition-all">
                  Settings
                </a>
              </li>
              <li>
                <a className="hover:bg-red-600 px-4 py-2 rounded font-medium transition-all cursor-pointer">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
