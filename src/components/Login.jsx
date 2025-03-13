import React from "react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("ranbirkapoor9@gmail.com");
  const [password, setPassword] = useState("Ranbir@123");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        console.log(res.data);
        dispatch(addUser(res.data));
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.includes("Wrong email")) {
        setError("Please enter a valid email address");
      } else if (err.response?.data?.includes("Invalid credentials")) {
        setError("Email or password is incorrect");
      } else {
        setError("Login failed. Please try again");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div
        className="card w-full max-w-md p-8 shadow-2xl border border-gray-700 
                      hover:border-primary transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Welcome <span className="text-primary">Back</span>
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Sign in to continue your journey
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          className="flex flex-col gap-5"
          onSubmit={handleLogin}
          method="POST"
        >
          <div className="form-control">
            <label className="label text-white font-medium">Email</label>
            <input
              type="email"
              value={emailId}
              placeholder="Enter your email"
              className="input input-bordered bg-base-300 text-white w-full 
                         focus:outline-none focus:ring-2 focus:ring-primary transition"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label text-white font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                className="input input-bordered bg-base-300 text-white w-full 
                           pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Eye-slash icon (password visible)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  // Eye icon (password hidden)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <a
            href="#"
            className="text-primary text-sm text-right hover:underline"
          >
            Forgot password?
          </a>

          <button
            className="btn btn-primary w-full hover:brightness-110 transition text-lg"
            type="submit"
          >
            Login
          </button>

          <div className="divider text-gray-400">OR</div>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
