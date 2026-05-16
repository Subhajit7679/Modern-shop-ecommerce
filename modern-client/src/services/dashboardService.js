import axios from "axios";

const API = "http://localhost:8000/api/dashboard";

export const getDashboardData =
  async () => {

    const response =
      await axios.get(`${API}/data`);

    return response.data;
};