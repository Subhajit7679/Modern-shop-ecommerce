import API from "./api";

export const getCategories = async () => {
  try {
    const response = await API.get("/category/all-category");

    return response.data;
  } catch (error) {
    console.log(error);

    return [];
  }
};