import API from "./api";

// LOGIN
export const loginUser = async (userData) => {

  const response = await API.post(
    "/signin",
    userData
  );

  return response.data;
};

// SIGNUP
export const signupUser = async (userData) => {

  const response = await API.post(
    "/signup",
    userData
  );

  return response.data;
};