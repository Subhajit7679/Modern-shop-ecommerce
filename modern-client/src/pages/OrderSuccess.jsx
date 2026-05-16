import { CheckCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div
      className="
      min-h-screen
      bg-black
      flex
      items-center
      justify-center
      px-6
    "
    >
      <div
        className="
        text-center
        animate-pulse
      "
      >
        <div
          className="
          flex
          justify-center
          mb-8
        "
        >
          <div
            className="
            w-28
            h-28
            rounded-full
            bg-green-500/10
            border
            border-green-500/30
            flex
            items-center
            justify-center
          "
          >
            <CheckCircle size={70} className="text-green-400" />
          </div>
        </div>

        <h1
          className="
          text-white
          text-5xl
          md:text-6xl
          font-black
          mb-5
        "
        >
          Order Successful
        </h1>

        <p
          className="
          text-zinc-400
          text-lg
          max-w-lg
          mx-auto
          mb-10
        "
        >
          Your premium fashion order has been placed successfully.
        </p>

        <div
          className="
          flex
          flex-col
          sm:flex-row
          gap-4
          justify-center
        "
        >
          <button
            onClick={() => navigate("/shop")}
            className="
              bg-white
              text-black
              px-8
              py-4
              rounded-2xl
              font-semibold
              hover:scale-105
              transition
            "
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/my-orders")}
            className="
              border
              border-zinc-700
              text-white
              px-8
              py-4
              rounded-2xl
              font-semibold
              hover:bg-zinc-900
              transition
            "
          >
            Track Your Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
