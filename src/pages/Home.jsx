import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getMyRestaurants, getAllRestaurants, getAllMenuItems, getCart } from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const Home = () => {


  const { user } = useAuth(); // ✅ NEW
  const isLoggedIn = !!user;  // ✅ NEW

  const restaurantsRef = useRef(null);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [restaurantError, setRestaurantError] = useState("");
  const [myrestaurant, setMyRestaurant] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [dishError, setDishError] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const fetchAllDishes = async () => {
    try {
      setLoadingDishes(true);
      setDishError("");

      const response = await getAllMenuItems();
      setAllDishes(response?.data || []);
    } catch (error) {
      console.error("Error fetching dishes →", error);
      setDishError("Failed to load dishes");
    } finally {
      setLoadingDishes(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const response = await getAllRestaurants();
      setRestaurants(response?.data || response || []);
    } catch (error) {
      console.error("Error fetching restaurants →", error);
      setRestaurantError("Failed to load restaurants");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await getCart();
      const items = response?.data?.items || [];

      const totalCount = items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      setCartCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count →", error);
    }
  };

  useEffect(() => {
    fetchAllDishes();
    fetchRestaurants();
  }, []);

  // ✅ FIXED: role-based execution after user loads
  useEffect(() => {
    if (!user) return;

    const fetchMyRestaurant = async () => {
      try {
        const res = await getMyRestaurants();
        const data = res?.data?.[0] || null;
        setMyRestaurant(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user.roles.includes("RESTAURANT_OWNER")) {
      fetchMyRestaurant();
    }

    if (user.roles.includes("CUSTOMER")) {
      fetchCartCount();
    }

  }, [user]); // ✅ IMPORTANT CHANGE

  const handleBrowse = () => {
    restaurantsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDishClick = (dish) => {
    navigate(`/restaurants?dishId=${dish.id}`);
  };

  return (
    <div className="min-h-screen">

      {/* ✅ UPDATED NAVBAR (removed role + isLoggedIn props) */}
      <Navbar restaurant={myrestaurant} cartCount={cartCount} />

      {/* rest of your code unchanged */}
      {/* Hero Section — unchanged */}
      <div className="flex items-center justify-between px-10 py-16 bg-orange-50 min-h-[480px]">
        <div className="max-w-xl">
          <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full mb-5">
            🍽 Order food you love
          </span>
          <h1 className="text-4xl font-medium leading-snug mb-4">
            Delicious food, <br /> delivered to your{" "}
            <span className="text-orange-500">door</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md">
            Discover hundreds of restaurants near you. Fast delivery, great
            prices, and food you'll love every time.
          </p>
          <div className="flex gap-3">
            <Link to="/signup">
              <button className="px-7 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition">
                Get Started
              </button>
            </Link>
            <button
              onClick={handleBrowse}
              className="px-7 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition"
            >
              Browse Restaurants
            </button>
          </div>
        </div>

        {/* Right Food Cards — unchanged */}
        <div className="flex flex-col gap-3 min-w-[260px]">
          {[
            { icon: "🍕", name: "Margherita Pizza", rest: "Pizza Palace", price: "₹299" },
            { icon: "🍔", name: "Classic Burger", rest: "Burger Barn", price: "₹199" },
            { icon: "🍜", name: "Spicy Ramen", rest: "Noodle House", price: "₹249" },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.rest}</p>
              </div>
              <p className="ml-auto text-sm font-medium text-orange-500">{item.price}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Dish Categories — unchanged */}
<div className="px-10 py-12 bg-white border-b border-gray-100">
  <h2 className="text-xl font-medium mb-8">What's on your mind?</h2>

  {loadingDishes && (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm">Loading dishes...</p>
    </div>
  )}

  {dishError && (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
      <p className="text-red-500 text-sm">{dishError}</p>
    </div>
  )}

  {!loadingDishes && !dishError && allDishes.length === 0 && (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm">No dishes found</p>
    </div>
  )}

  {!loadingDishes && !dishError && allDishes.length > 0 && (
    <div className="grid grid-cols-5 gap-6">
      {allDishes.map((dish) => (
        <div
          key={dish.id}
          onClick={() => handleDishClick(dish)}
          className="flex flex-col items-center gap-3 cursor-pointer group"
        >
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-3xl group-hover:bg-orange-100 transition">
            {dish.isVeg ? "🟢" : "🔴"}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition">
              {dish.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {dish.description || "No description"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Restaurants Section */}
      <div ref={restaurantsRef} className="px-10 py-12 bg-white">
        <h2 className="text-2xl font-medium mb-2">
          All <span className="text-orange-500">Restaurants</span>
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Explore restaurants and order your favourite food
        </p>

        {/* Loading */}
        {loadingRestaurants && (
          <div className="flex justify-center py-16">
            <p className="text-gray-400 text-sm">Loading restaurants...</p>
          </div>
        )}

        {/* Error */}
        {restaurantError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-500 text-sm">{restaurantError}</p>
          </div>
        )}

        {/* Empty state — before Browse is clicked */}
        {!loadingRestaurants && restaurants.length === 0 && !restaurantError && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🍽</p>
            <p className="text-gray-400 text-sm">
              Click "Browse Restaurants" to see all restaurants
            </p>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loadingRestaurants && restaurants.length > 0 && (
          <div className="grid grid-cols-3 gap-5">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-orange-200 transition cursor-pointer"
              >
                <div className="w-full h-28 bg-orange-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                  🍽
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.address}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    r.active
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {r.active ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400 truncate max-w-[60%]">{r.description || "—"}</p>
                <button
                onClick={() => navigate(`/restaurant/${r.id}/menu`)}
                className="text-xs text-orange-500 font-medium hover:underline"
                >
                View Menu →
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;