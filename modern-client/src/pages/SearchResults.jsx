import React, { useEffect, useState } from "react";

import axios from "axios";

import { useLocation, Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();

  // GET QUERY
  const query = new URLSearchParams(location.search).get("q");

  // STATES
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  const [sort, setSort] = useState("");

  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  // FETCH SEARCH PRODUCTS
  useEffect(() => {
    if (query) {
      fetchPaginatedProducts(currentPage);
    }

    fetchCategories();
  }, [query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8000/api/product/search?q=${query}`,
      );

      setProducts(response.data.products);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/category/all-category",
      );

      console.log(response.data);

      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/product/filter-products",
        {
          category: selectedCategory,
          minPrice,
          maxPrice,
          sort,
        },
      );

      setProducts(response.data.products);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  const fetchPaginatedProducts = async (pageNumber) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:8000/api/product/paginate-products?page=${pageNumber}&limit=4`,
      );

      setProducts(response.data.products);

      setCurrentPage(response.data.currentPage);

      setTotalPages(response.data.totalPages);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-16 py-10">
      {/* HEADING */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Search Results</h1>

        <p className="text-zinc-400 mt-2">
          Showing results for:
          <span className="text-white font-semibold ml-2">"{query}"</span>
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-xl">Loading products...</div>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold">No Products Found</h1>

          <p className="text-zinc-500 mt-3">Try searching another keyword</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-10 items-center">
        {/* CATEGORY */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl min-w-[220px] outline-none"
        >
          <option value="">All Categories</option>

          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.cName}
            </option>
          ))}
        </select>

        {/* MIN PRICE */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none min-w-[180px]"
        />

        {/* MAX PRICE */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none min-w-[180px]"
        />

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none min-w-[220px]"
        >
          <option value="">Sort By</option>

          <option value="low-high">Price Low to High</option>

          <option value="high-low">Price High to Low</option>

          <option value="newest">Newest</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={applyFilters}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Apply Filters
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition duration-300 hover:scale-[1.02]"
          >
            {/* IMAGE */}
            <img
              src={`http://localhost:8000/uploads/products/${item.pImages[0]}`}
              alt={item.pName}
              className="h-72 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">
              <h2 className="text-lg font-bold">{item.pName}</h2>

              <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                {item.pDescription}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold">₹{item.pPrice}</span>

                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition">
                  View
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchPaginatedProducts(currentPage - 1)}
          className="bg-zinc-800 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-white text-lg">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchPaginatedProducts(currentPage + 1)}
          className="bg-zinc-800 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
