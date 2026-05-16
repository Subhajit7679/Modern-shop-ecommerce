import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../services/authService";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("Signup Clicked");

    try {
      const data = await signupUser({
        name,
        email,
        password,
        cPassword,
      });

      console.log(data);

      if (data.success) {
        toast.success(data.success);

        navigate("/login");
      } else {
        toast.error(
          data.error?.email ||
            data.error?.password ||
            data.error?.name ||
            "Signup Failed",
        );
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-white mb-10">Signup</h1>

        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-[1.02] transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
