import { useState } from "react";
import API from "../services/api";

function AddCategory() {
  const [name, setName] = useState("");
  const [genders, setGenders] = useState(["Unisex"]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    if (genders.length === 0) {
      alert("Select at least one gender");
      return;
    }

    try {
      const response = await API.post("/category/add-category", {
        cName: name.trim(),
        cGender: genders,
      });

      console.log("CATEGORY RESPONSE:", response.data);
      console.log("CATEGORY GENDERS SENT:", genders);

      alert("Category Added");

      setName("");
      setGenders(["Unisex"]);
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  return (
    <div className="text-white px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">Add Category</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          />
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-zinc-300">
              Available For
            </label>

            <div className="flex flex-wrap gap-3">
              {["Men", "Women", "Unisex"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={genders.includes(gender)}
                    onChange={() => {
                      setGenders((prev) =>
                        prev.includes(gender)
                          ? prev.filter((item) => item !== gender)
                          : [...prev, gender],
                      );
                    }}
                  />

                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;
