import { useParams } from "react-router-dom";
import { intiatePayment } from "../api/authApi";

const PaymentPage = () => {
  const { orderId } = useParams();

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

        handler: function (response) {
          alert("Payment Successful ✅");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">Complete Your Payment</h1>

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