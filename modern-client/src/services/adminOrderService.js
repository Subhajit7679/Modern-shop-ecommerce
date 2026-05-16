import axios from "axios";

const API =
  "http://localhost:8000/api/order";

/* GET ALL ORDERS */

export const getAllOrders =
  async () => {

    try {

      const response =
        await axios.get(
          `${API}/get-all-orders`
        );

      return response.data;

    } catch (err) {

      console.log(err);

      return {
        success: false,
      };

    }

  };

/* UPDATE ORDER STATUS */

export const updateOrderStatus =
  async (oId, status) => {

    try {

      const response =
        await axios.post(
          `${API}/update-order`,
          {
            oId,
            status,
          }
        );

      return response.data;

    } catch (err) {

      console.log(err);

      return {
        success: false,
      };

    }

  };