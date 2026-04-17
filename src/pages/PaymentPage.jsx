import { useParams } from "react-router-dom";
import { intiatePayment, paymentStatus } from "../api/authApi";
import { useState } from "react";

const PaymentPage = () => {
  const { orderId } = useParams();
  const [checking, setChecking] = useState(false);

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

  // ✅ Poll backend for real payment status
  const pollStatus = () => {
    let count = 0;

    const interval = setInterval(async () => {
      try {
        const res = await paymentStatus(orderId);
        const status = res?.data?.status;

        console.log("STATUS →", status);

        if (status === "COMPLETED") {
          clearInterval(interval);
          alert("Payment Successful 🎉");
          window.location.href = `/order-success/${orderId}`;
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

        // ❌ DO NOT trust this
        handler: function () {
          console.log("Razorpay success callback");
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        alert("Payment Failed ❌");
      });

      rzp.open();

      // ✅ Start checking status AFTER opening UI
      setChecking(true);
      pollStatus();

    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">Complete Your Payment</h1>

      {checking && (
        <p className="text-sm text-gray-500 mb-2">
          Checking payment status...
        </p>
      )}

      <button
        onClick={handlePayment}
        className="bg-green-500 text-white px-6 py-3 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;