import axios from "axios";

const API =
  "http://localhost:8000/api/order";

/* CREATE ORDER */

export const createOrder = async (
  orderData
) => {

  try {

    const response = await axios.post(
      `${API}/create-order`,
      orderData
    );

    return response.data;

  } catch (err) {

    console.log(err);

    return {
      success: false,
      error: "Order Failed",
    };

  }

};