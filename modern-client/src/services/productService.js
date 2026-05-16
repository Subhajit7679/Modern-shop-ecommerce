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
    const response = await axios.delete(`${API}/delete-product/${id}`);

    return response.data;
  } catch (err) {
    console.log(err);

    return {
      success: false,
      error: "Delete Failed",
    };
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
   

export const searchProduct = async (
  keyword
) => {

  try {

    const response = await axios.post(
      `${API}/search-product`,
      { keyword }
    );

    return response.data;

  } catch (error) {

    console.log(error);

  }

};