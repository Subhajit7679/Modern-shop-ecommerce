import { useState } from "react";
import API from "../services/api";

function AddCategory() {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/category/add-category", {
        cName: name,
      });

      console.log(response.data);

      alert("Category Added");

      setName("");
    } catch (error) {
      console.log(error);

      alert("Failed");
    }
  };

  return (
    <div className="text-white px-8 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Add Category
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
          />

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