import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyRestaurants, getRestaurantMenu, getCart } from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const MyRestaurant = () => {


  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dishesLoading, setDishesLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const items = response?.data?.items || [];

      const totalCount = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      setCartCount(totalCount);
    } catch (err) {
      console.error("Cart count error →", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMyRestaurants();
        const data = response?.data?.[0] || null;
        setRestaurant(data);

        if (data?.id) {
          setDishesLoading(true);
          const menuResponse = await getRestaurantMenu(data.id);
          console.log("Menu →", menuResponse);
          setDishes(menuResponse?.data || []);
        }
      } catch (err) {
        console.error("Error →", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
        setDishesLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
      fetchCartCount();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]); // ✅ updated dependency

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar restaurant={restaurant} cartCount={cartCount} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar restaurant={null} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
          <p className="text-gray-400 text-sm">
            You haven't created a restaurant yet.
          </p>
          <button
            onClick={() => navigate("/create-restaurant")}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            + Create Restaurant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar restaurant={restaurant} cartCount={cartCount} />

        <div className="max-w-2xl mx-auto px-4 pt-6">
    <button
      onClick={() => navigate("/")}
      className="text-sm text-gray-500 hover:text-orange-500"
    >
      ← Back to Home
    </button>
  </div>


      <div className="max-w-2xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-medium">{restaurant.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{restaurant.address}</p>
              {restaurant.description && (
                <p className="text-gray-500 text-sm mt-2">{restaurant.description}</p>
              )}
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              restaurant.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
            }`}>
              {restaurant.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Dishes Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">
            Menu{" "}
            <span className="text-gray-400 font-normal text-sm">
              ({dishes.length} dishes)
            </span>
          </h2>
          <button
            onClick={() => navigate(`/add-dishes?restaurantId=${restaurant.id}`)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            + Add Dish
          </button>
        </div>

        {/* Dishes Loading */}
        {dishesLoading && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Loading menu...</p>
          </div>
        )}

        {/* No Dishes */}
        {!dishesLoading && dishes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No dishes added yet.</p>
          </div>
        )}

        {/* Dishes List */}
        {!dishesLoading && dishes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {dishes.map((d) => (
              <div key={d.menuItemId} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{d.name}</p>
                    <span className="text-xs">{d.isVeg ? "🟢" : "🔴"}</span>
                    {!d.isAvailable && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                  {d.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-orange-500">₹{d.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurant;