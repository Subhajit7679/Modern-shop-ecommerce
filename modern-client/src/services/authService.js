import API from "./api";

// LOGIN
export const loginUser = async (userData) => {
  const response = await API.post("/signin", userData);

  return response.data;
};

// SIGNUP
export const signupUser = async (userData) => {
  const response = await API.post("/signup", userData);

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await API.post("/forgot-password", { email });

  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await API.post("/reset-password", {
    token,
    password,
  });

  return response.data;
};
