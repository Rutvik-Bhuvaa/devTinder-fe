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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        {
          withCredentials: true,
        }
      );

      if (res.data) {
        dispatch(addUser(res.data));
      }
      navigate("/");
    } catch (err) {
      console.error(err);
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
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              className="input input-bordered bg-base-300 text-white w-full 
                         focus:outline-none focus:ring-2 focus:ring-primary transition"
              onChange={(e) => setPassword(e.target.value)}
            />
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
