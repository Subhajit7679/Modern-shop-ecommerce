import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));

        console.log(localUser);

        const response = await axios.post(
          "http://localhost:8000/api/user/single-user",
          {
            uId: localUser.user._id,
          },
        );

        console.log(response.data);

        setUser(response.data.User);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  if (!user) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-10">My Profile</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <div className="flex items-center gap-6 mb-10">
            <img
              src="https://i.pravatar.cc/150"
              alt="user"
              className="w-24 h-24 rounded-full"
            />

            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>

              <p className="text-zinc-400 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 mb-2">Full Name</p>

              <h3 className="text-xl font-semibold">{user.name}</h3>
            </div>

            <div className="bg-black border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 mb-2">Email</p>

              <h3 className="text-xl font-semibold">{user.email}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
