
import { useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  resetPassword,
} from "../services/authService";

function ResetPassword() {
  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const response =
        await resetPassword(
          token,
          password
        );

      if (
        response.success
      ) {
        toast.success(
          "Password Updated"
        );

        navigate(
          "/login"
        );
      } else {
        toast.error(
          response.message
        );
      }
    };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-white mb-8">
          Reset Password
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold"
          >
            Update Password
          </button>
        </form>

      </div>
    </div>
  );
}

export default ResetPassword;

