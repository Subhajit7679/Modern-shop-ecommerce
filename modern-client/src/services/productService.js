import axios from "axios";

const API = "http://localhost:8000/api/product";

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API}/all-product`);

    return response.data;
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: "Failed To Fetch Products",
    };
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (id) => {
  try {
    const response = await axios.get(`${API}/single-product/${id}`);

    return response.data;
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: "Failed To Fetch Product",
    };
  }
};

// ADD PRODUCT
export const addProduct = async (formData, token) => {
  try {
    const response = await axios.post(`${API}/add-product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: "Add Product Failed",
    };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/product/delete-product/${id}`
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return error.response.data;
  }
};

export const getProductCount = async () => {
  try {
    const response = await axios.get(`${API}/product-count`);

    return response.data;
  } catch (err) {
    console.log(err);

    return {
      success: false,
    };
  }
};

export const updateProduct = async (data) => {
  try {
    const response = await axios.put(
      `${API}/edit-product/${data.get("pId")}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Update Failed",
    };
  }
};
