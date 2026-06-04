import axios from "axios";

const API = "${import.meta.env.VITE_API_URL}/dashboard";

export const getDashboardData =
  async () => {

    const response =
      await axios.get(`${API}/data`);

    return response.data;
};