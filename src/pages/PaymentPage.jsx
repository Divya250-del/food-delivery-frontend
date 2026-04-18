import { useParams, useNavigate } from "react-router-dom";
import { intiatePayment, paymentStatus, getOrderById } from "../api/authApi";
import { useState, useEffect } from "react";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // ✅ FETCH ORDER DETAILS
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);

        const res = await getOrderById(orderId);

        const data = res?.data;

        setItems(data?.items || []);
        setTotalAmount(data?.totalAmount || 0);

      } catch (err) {
        console.error("Failed to load order →", err);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const pollStatus = () => {
    let count = 0;

    const interval = setInterval(async () => {
      try {
        const res = await paymentStatus(orderId);
        const status = res?.data?.status;

        if (status === "COMPLETED") {
          clearInterval(interval);
          alert("Payment Successful 🎉");
          window.location.href = `/my-orders`;
        }

        if (status === "FAILED") {
          clearInterval(interval);
          alert("Payment Failed ❌");
        }

        count++;
        if (count > 15) {
          clearInterval(interval);
          alert("Still processing... check orders page");
        }

      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);
  };

  const handlePayment = async () => {
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay failed to load");
        return;
      }

      const paymentRes = await intiatePayment(orderId);

      const { orderId: razorpayOrderId, keyId, amount } =
        paymentRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: "INR",
        name: "Food Delivery",
        description: "Order Payment",
        order_id: razorpayOrderId,

        handler: function () {
          console.log("Razorpay success callback");
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment Failed ❌");
      });

      rzp.open();

      setChecking(true);
      pollStatus();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-orange-500 mb-4"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-semibold text-center mb-2">
          Complete Payment
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Order #{orderId}
        </p>

        {/* LOADING */}
        {loadingOrder ? (
          <p className="text-center text-gray-400 mb-6">
            Loading order details...
          </p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
              <p className="text-sm text-gray-500 mb-3">
                Order Items
              </p>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm mb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm font-semibold">
                <span>Total Amount</span>
                <span className="text-orange-500">
                  ₹{totalAmount}
                </span>
              </div>
            </div>
          </>
        )}

        {/* STATUS */}
        {checking && (
          <p className="text-center text-orange-500 text-sm mb-4 animate-pulse">
            Checking payment status...
          </p>
        )}

        {/* PAY */}
        <button
          onClick={handlePayment}
          disabled={loadingOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          Pay ₹{totalAmount}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;