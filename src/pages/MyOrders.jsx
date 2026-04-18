import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMyOrders, getCart, getMyRestaurants } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {


  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [restaurant, setRestaurant] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const items = response?.data?.items || [];
      const total = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCartCount(total);
    } catch (err) {
      console.error("Cart count error →", err);
    }
  };

  useEffect(() => {
    const fetchNavbarRestaurant = async () => {
      try {
        if (isLoggedIn) {
          const res = await getMyRestaurants();
          setRestaurant(res?.data?.[0] || res?.[0] || null);
        }
      } catch (err) {
        console.error("Navbar restaurant error →", err);
      }
    };

    fetchNavbarRestaurant();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();
        console.log("My orders →", response);

        setOrders(response?.data || []);
      } catch (err) {
        console.error("Orders fetch error →", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ✅ UPDATED NAVBAR */}
      <Navbar restaurant={restaurant} cartCount={cartCount} />

      <div className="max-w-4xl mx-auto px-4 pt-6">
    <button
      onClick={() => navigate("/")}
      className="text-sm text-gray-500 hover:text-orange-500"
    >
      ← Back to Home
    </button>
  </div>


      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-2">
          My <span className="text-orange-500">Orders</span>
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Track your placed orders
        </p>

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">Loading orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="grid gap-5">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">
                      Order #{order.orderId}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Restaurant ID: {order.restaurantId}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-500 font-medium">
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  {order.items?.map((item) => (
                    <div
                      key={item.menuItemId}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm text-orange-500 font-medium">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-base font-semibold text-orange-500">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;