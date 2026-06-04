
import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/order`;

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

/* CREATE RAZORPAY ORDER */

export const createRazorpayOrder =
  async (amount) => {
    try {
      const response =
        await axios.post(
          `${API}/create-razorpay-order`,
          {
            amount,
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

/* VERIFY PAYMENT */

export const verifyPayment =
  async (paymentData) => {
    try {
      const response =
        await axios.post(
          `${API}/verify-payment`,
          paymentData
        );

      return response.data;
    } catch (err) {
      console.log(err);

      return {
        success: false,
      };
    }
  };

