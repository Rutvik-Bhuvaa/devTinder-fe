import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.err(err);
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-[#4F46E5] to-[#6366F1] shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold text-white">
          DevTinder
        </Link>
      </div>
      {userData && (
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">
            Hey, {userData.firstName}! 👋
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
                  src={userData.photoURL}
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
                <Link
                  to="/profile"
                  className="flex justify-between hover:bg-gray-800 px-4 py-2 rounded font-medium transition-all"
                >
                  Profile{" "}
                  <span className="badge bg-indigo-500 text-white">New</span>
                </Link>
              </li>
              <li>
                <a className="hover:bg-gray-800 px-4 py-2 rounded font-medium transition-all">
                  Settings
                </a>
              </li>
              <li>
                <a
                  className="hover:bg-red-600 px-4 py-2 rounded font-medium transition-all cursor-pointer"
                  onClick={handleLogout}
                >
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
