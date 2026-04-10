import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { getAllRestaurants } from "../api/authApi";

// ... DISHES array stays same ...
const DISHES = [
  { id: 1, name: "Pizza", emoji: "🍕" },
  { id: 2, name: "Burger", emoji: "🍔" },
  { id: 3, name: "Biryani", emoji: "🍛" },
  { id: 4, name: "Ramen", emoji: "🍜" },
  { id: 5, name: "Tacos", emoji: "🌮" },
  { id: 6, name: "Sushi", emoji: "🍣" },
  { id: 7, name: "Cake", emoji: "🎂" },
  { id: 8, name: "Salad", emoji: "🥗" },
  { id: 9, name: "Shake", emoji: "🥤" },
  { id: 10, name: "Sandwich", emoji: "🥪" },
];

const Home = () => {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const restaurantsRef = useRef(null);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [restaurantError, setRestaurantError] = useState("");

  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const response = await getAllRestaurants();
      console.log("Restaurants →", response); // verify structure
      setRestaurants(response?.data || response || []);
    } catch (error) {
      console.error("Error fetching restaurants →", error);
      setRestaurantError("Failed to load restaurants");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const handleBrowse = () => {
    fetchRestaurants();
    restaurantsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDishClick = (dish) => {
    navigate(`/restaurants?dish=${dish.name}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} role={role} />

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

      {/* Stats Bar — unchanged */}
      <div className="flex bg-gray-50 border-t border-gray-100">
        {[
          { num: "500+", label: "Restaurants" },
          { num: "10k+", label: "Happy Customers" },
          { num: "30 min", label: "Avg Delivery" },
          { num: "4.8★", label: "Avg Rating" },
        ].map((s, i) => (
          <div key={i} className={`flex-1 text-center py-6 ${i !== 3 ? "border-r border-gray-100" : ""}`}>
            <p className="text-2xl font-medium text-orange-500">{s.num}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Dish Categories — unchanged */}
      <div className="px-10 py-12 bg-white border-b border-gray-100">
        <h2 className="text-xl font-medium mb-8">What's on your mind?</h2>
        <div className="grid grid-cols-5 gap-6">
          {DISHES.map((dish) => (
            <div
              key={dish.id}
              onClick={() => handleDishClick(dish)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-4xl group-hover:bg-orange-100 transition">
                {dish.emoji}
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-orange-500 transition">
                {dish.name}
              </p>
            </div>
          ))}
        </div>
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
                  <button className="text-xs text-orange-500 font-medium hover:underline">
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