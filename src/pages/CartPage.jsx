import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getCart, getMyRestaurants, placeOrder } from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const CartPage = () => {


  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

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
    const fetchCartData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCart();
        console.log("Cart response →", response);

        const cartData = response?.data || null;
        setCart(cartData);
        setItems(cartData?.items || []);
      } catch (err) {
        console.error("Cart fetch error →", err);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handlePlaceOrder = async () => {
    try {
      if (!cart?.restaurantId) {
        alert("Restaurant not found for this cart");
        return;
      }

      setPlacingOrder(true);

      const payload = {
        restaurantId: Number(cart.restaurantId),
      };

      console.log("Place order payload →", payload);

      const response = await placeOrder(payload);
      console.log("Place order response →", response);

      alert("Order placed successfully ✅");

      setCart(null);
      setItems([]);
    } catch (error) {
      console.error("Place order error →", error);

      if (error?.response?.status === 401) {
        alert("Please login first ❌");
      } else {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to place order"
        );
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const cartCount = (items || []).reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ✅ UPDATED NAVBAR */}
      <Navbar restaurant={restaurant} cartCount={cartCount} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-2">
          Your <span className="text-orange-500">Cart</span>
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Review your items before placing order
        </p>

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">Loading cart...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-medium mb-4">
                Cart Items ({items.length})
              </h2>

              <div className="flex flex-col">
                {items.map((item, index) => (
                  <div
                    key={`${item.menuItemId}-${index}`}
                    className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-500">
                        ₹{item.price}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Subtotal: ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium">Total Amount</p>
                <p className="text-xl font-semibold text-orange-500">
                  ₹{cart?.totalAmount || 0}
                </p>
              </div>

                <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || items.length === 0}
                className="w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;