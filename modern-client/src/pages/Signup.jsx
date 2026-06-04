import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser, loginUser } from "../services/authService";
import { useLocation } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      navigate("/");
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== cPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      const signupData = await signupUser({
        name,
        email,
        password,
        cPassword,
      });

      if (signupData.success) {
        // AUTO LOGIN

        const loginData = await loginUser({
          email,
          password,
        });

        if (loginData.token) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              token: loginData.token,
              user: loginData.user,
            }),
          );

          toast.success("Account Created Successfully");

          const redirectTo = location.state?.from || "/";

          navigate(redirectTo);
        } else {
          toast.success("Account created. Please login.");

          navigate("/login", {
            state: {
              from: location.state?.from,
            },
          });
        }
      } else {
        toast.error(
          signupData.error?.email ||
            signupData.error?.password ||
            signupData.error?.name ||
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

          <p className="text-zinc-400 text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
