
import { useState } from "react";
import toast from "react-hot-toast";

import {
  forgotPassword,
} from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await forgotPassword(
            email
          );

        if (
          response.success
        ) {
          toast.success(
            response.message
          );
        } else {
          toast.error(
            response.message
          );
        }
      } catch (error) {
        toast.error(
          "Something went wrong"
        );
      }
    };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-white mb-8">
          Forgot Password
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-6"
        >
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold"
          >
            Send Reset Link
          </button>
        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;

