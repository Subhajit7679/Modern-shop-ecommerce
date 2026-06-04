
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  // TRACKING STEPS

  const steps = [
    "Not processed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

  const currentStep = steps.indexOf(order?.status);

  // CANCEL ORDER

  const cancelOrder = async () => {
    try {
      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/order/update-order",
        {
          oId: order._id,
          status: "Cancelled",
        },
      );

      if (response.data.success) {
        toast.success("Order cancelled");

        setOrder({
          ...order,
          status: "Cancelled",
        });
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  // DOWNLOAD INVOICE

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // TITLE

    doc.setFontSize(24);

    doc.text("ModernShop Invoice", 14, 20);

    // ORDER INFO

    doc.setFontSize(12);

    doc.text(`Order ID: ${order.orderId}`, 14, 40);

    doc.text(
      `Date: ${new Date(order.createdAt).toDateString()}`,
      14,
      48,
    );

    doc.text(`Status: ${order.status}`, 14, 56);

    // SHIPPING

    doc.text(
      `Address: ${order.shippingAddress?.house}, ${order.shippingAddress?.area}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`,
      14,
      72,
    );

    doc.text(
      `Phone: ${order.shippingAddress?.phone}`,
      14,
      80,
    );

    // TABLE

    autoTable(doc, {
      startY: 95,

      head: [["Product", "Size", "Qty", "Price"]],

      body: order.allProduct.map((item) => [
        item.id?.pName,

        item.selectedSize || "N/A",

        item.quantity,

        `₹ ${item.id?.pPrice}`,
      ]),
    });

    // TOTAL

    doc.setFontSize(18);

    doc.text(
      `Total Amount: ₹ ${order.amount}`,
      14,
      doc.lastAutoTable.finalY + 20,
    );

    // SAVE PDF

    doc.save(`${order.orderId}-invoice.pdf`);
  };

  // FETCH ORDER

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.post(
          "${import.meta.env.VITE_API_URL}/order/single-order",
          {
            orderId: id,
          },
        );

        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrder();
  }, [id]);

  // LOADING

  if (!order) {
    return (
      <div
        className="
          min-h-screen
          bg-black
          text-white
          flex
          items-center
          justify-center
          text-2xl
          font-semibold
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        px-4
        md:px-8
        py-10
      "
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-12">
          <p
            className="
              uppercase
              tracking-[6px]
              text-zinc-500
              text-sm
              mb-3
            "
          >
            Order Details
          </p>

          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
            "
          >
            Order Summary
          </h1>
        </div>

        {/* TOP SECTION */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-8
            mb-8
            grid
            md:grid-cols-5
            gap-8
          "
        >
          {/* ORDER ID */}

          <div>
            <p className="text-zinc-500 mb-3">
              Order ID
            </p>

            <h2 className="font-semibold break-all">
              {order.orderId}
            </h2>
          </div>

          {/* DATE */}

          <div>
            <p className="text-zinc-500 mb-3">
              Date
            </p>

            <h2 className="font-semibold">
              {new Date(
                order.createdAt,
              ).toDateString()}
            </h2>

            {order.estimatedDelivery && (
              <p className="text-green-400 mt-3">
                Delivery By :{" "}
                {new Date(
                  order.estimatedDelivery,
                ).toDateString()}
              </p>
            )}
          </div>

          {/* PAYMENT */}

          <div className="min-w-[160px]">
            <p className="text-zinc-500 mb-3">
              Payment
            </p>

            <h2 className="font-semibold mb-4">
              {order.paymentMethod}
            </h2>

            <span
              className={`
                inline-block
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold

                ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }
              `}
            >
              {order.paymentStatus}
            </span>
          </div>

          {/* STATUS */}

          <div className="min-w-[160px]">
            <p className="text-zinc-500 mb-3">
              Status
            </p>

            <span
              className={`
                inline-block
                px-5
                py-2
                rounded-full
                text-sm
                font-semibold

                ${
                  order.status === "Delivered"
                    ? "bg-green-500/20 text-green-400"
                    : order.status === "Cancelled"
                    ? "bg-red-500/20 text-red-400"
                    : order.status === "Shipped"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }
              `}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* PRODUCTS */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-8
            mb-8
          "
        >
          <div className="space-y-6">
            {order.allProduct?.map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    bg-black
                    border
                    border-zinc-800
                    rounded-3xl
                    p-5
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    gap-5
                  "
                >
                  {/* IMAGE */}

                  <img
                    src={`https://modern-shop-backend-hfi9.onrender.com/uploads/products/${item.id?.pImages?.[0]}`}
                    alt=""
                    className="
                      w-32
                      h-32
                      object-cover
                      rounded-2xl
                    "
                  />

                  {/* INFO */}

                  <div className="flex-1">
                    <h2
                      className="
                        text-3xl
                        font-black
                        mb-3
                      "
                    >
                      {item.id?.pName}
                    </h2>

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >
                      <span
                        className="
                          bg-zinc-900
                          border
                          border-zinc-700
                          px-4
                          py-2
                          rounded-xl
                          text-sm
                        "
                      >
                        Qty : {item.quantity}
                      </span>

                      <span
                        className="
                          bg-zinc-900
                          border
                          border-zinc-700
                          px-4
                          py-2
                          rounded-xl
                          text-sm
                        "
                      >
                        Size :{" "}
                        {item.selectedSize ||
                          "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* PRICE */}

                  <div className="text-left md:text-right">
                    <p className="text-zinc-500">
                      Price
                    </p>

                    <h2
                      className="
                        text-4xl
                        font-black
                        mt-2
                      "
                    >
                      ₹ {item.id?.pPrice}
                    </h2>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* SHIPPING */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-[32px]
            p-8
            mb-8
          "
        >
          <p
            className="
              uppercase
              tracking-[5px]
              text-zinc-500
              text-sm
              mb-4
            "
          >
            Shipping
          </p>

          <h2
            className="
              text-3xl
              font-black
              mb-6
            "
          >
            Delivery Address
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-zinc-500 mb-1">
                Address
              </p>

              <div className="space-y-2">
                <h2 className="text-xl font-bold">
                  {
                    order.shippingAddress
                      ?.fullName
                  }
                </h2>

                <p>
                  {
                    order.shippingAddress
                      ?.house
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.area
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      ?.state
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.pincode
                  }
                </p>

                {order.shippingAddress
                  ?.landmark && (
                  <p>
                    Landmark :{" "}
                    {
                      order.shippingAddress
                        ?.landmark
                    }
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-zinc-500 mb-1">
                Phone
              </p>

              <h2 className="text-lg">
                {
                  order.shippingAddress
                    ?.phone
                }
              </h2>
            </div>
          </div>
        </div>

        {/* ORDER TRACKER */}

        {order.status !== "Cancelled" && (
          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-[32px]
              p-8
              mb-8
            "
          >
            <p
              className="
                uppercase
                tracking-[5px]
                text-zinc-500
                text-sm
                mb-4
              "
            >
              Tracking
            </p>

            <h2
              className="
                text-3xl
                font-black
                mb-10
              "
            >
              Order Progress
            </h2>

            <div
              className="
                flex
                items-center
                justify-between
                relative
              "
            >
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="
                    flex-1
                    flex
                    flex-col
                    items-center
                    relative
                    z-10
                  "
                >
                  {/* LINE */}

                  {index !==
                    steps.length - 1 && (
                    <div
                      className={`
                        absolute
                        top-5
                        left-1/2
                        right-[-50%]
                        h-1

                        ${
                          index < currentStep
                            ? "bg-green-500"
                            : "bg-zinc-700"
                        }
                      `}
                    />
                  )}

                  {/* CIRCLE */}

                  <div
                    className={`
                      w-10
                      h-10
                      rounded-full
                      flex
                      items-center
                      justify-center
                      font-bold
                      border-4

                      ${
                        index <= currentStep
                          ? "bg-green-500 border-green-400 text-black"
                          : "bg-black border-zinc-700 text-zinc-500"
                      }
                    `}
                  >
                    {index + 1}
                  </div>

                  {/* LABEL */}

                  <p
                    className={`
                      mt-4
                      text-sm
                      font-medium
                      text-center

                      ${
                        index <= currentStep
                          ? "text-white"
                          : "text-zinc-500"
                      }
                    `}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}

        <div
          className="
            flex
            flex-wrap
            justify-end
            gap-4
            mb-8
          "
        >
          {order.status ===
            "Not processed" && (
            <button
              onClick={cancelOrder}
              className="
                bg-red-500
                text-white
                px-8
                py-4
                rounded-2xl
                font-bold
                hover:scale-105
                transition
              "
            >
              Cancel Order
            </button>
          )}

          <button
            onClick={downloadInvoice}
            className="
              bg-white
              text-black
              px-8
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition
            "
          >
            Download Invoice
          </button>
        </div>

        {/* TOTAL */}

        <div
          className="
            bg-white
            text-black
            rounded-[32px]
            p-8
            flex
            flex-col
            md:flex-row
            md:items-center
            justify-between
            gap-6
          "
        >
          <div>
            <p className="text-zinc-600 mb-2">
              Total Amount
            </p>

            <h2
              className="
                text-5xl
                font-black
              "
            >
              ₹ {order.amount}
            </h2>
          </div>

          <div>
            <p className="text-zinc-600 mb-2">
              Order Status
            </p>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              {order.status}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;

