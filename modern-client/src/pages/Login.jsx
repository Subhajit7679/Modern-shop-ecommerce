import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import toast from "react-hot-toast";

import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await loginUser({
      email,
      password,
    });

    if (data.token) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          user: data.user,
        }),
      );

      toast.success("Login Successful");

      const redirectTo = location.state?.from || "/";

      navigate(redirectTo);
    } else {
      toast.error(data.error || "Login Failed");
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-white mb-10">Login</h1>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-[1.02] transition"
          >
            Login
          </button>

          <p
            onClick={() => navigate("/forgot-password")}
            className="
    text-zinc-400
    text-sm
    cursor-pointer
    hover:text-white
  "
          >
            Forgot Password?
          </p>

          <p className="text-zinc-400 text-center mt-6">
            Don't have an account?{" "}
            <span
              onClick={() =>
                navigate("/signup", {
                  state: {
                    from: location.state?.from,
                  },
                })
              }
              className="text-white cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
