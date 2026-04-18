import { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyRestaurants,
  getAllRestaurants,
  getAllMenuItems,
  getCart,
} from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

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

  // =========================
  // API CALLS
  // =========================

  const fetchAllDishes = async () => {
    if (!isLoggedIn) return;
    try {
      setLoadingDishes(true);
      setDishError("");
      const response = await getAllMenuItems();
      setAllDishes(response?.data || []);
    } catch {
      setDishError("Failed to load dishes");
    } finally {
      setLoadingDishes(false);
    }
  };

  const fetchRestaurants = async () => {
    if (!isLoggedIn) return;
    try {
      setLoadingRestaurants(true);
      setRestaurantError("");
      const response = await getAllRestaurants();
      setRestaurants(response?.data || []);
    } catch {
      setRestaurantError("Failed to load restaurants");
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await getCart();
      const total =
        res?.data?.items?.reduce((t, i) => t + i.quantity, 0) || 0;
      setCartCount(total);
    } catch {}
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchAllDishes();
    fetchRestaurants();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!user) return;

    if (user.roles.includes("RESTAURANT_OWNER")) {
      getMyRestaurants().then(res =>
        setMyRestaurant(res?.data?.[0] || null)
      );
    }

    if (user.roles.includes("CUSTOMER")) {
      fetchCartCount();
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      <Navbar restaurant={myrestaurant} cartCount={cartCount} />

      {/* HERO */}
      <div className="flex items-center justify-between px-10 py-20 bg-orange-50">
        <div className="max-w-xl">
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs">
            🍽 Order food you love
          </span>

          <h1 className="text-5xl font-semibold mt-4 mb-4">
            Delicious food,
            <br />
            delivered to your{" "}
            <span className="text-orange-500">door</span>
          </h1>

          <p className="text-gray-500 mb-6">
            Discover hundreds of restaurants near you
          </p>

          <div className="flex gap-4">
            {!isLoggedIn ? (
              <Link to="/signup">
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg">
                  Get Started
                </button>
              </Link>
            ) : (
              <button
                onClick={() =>
                  restaurantsRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg"
              >
                Browse Restaurants
              </button>
            )}
          </div>
        </div>

        {/* 🔥 UPDATED JUNK FOOD IMAGE */}
        <div className="hidden md:block w-[420px]">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
            alt="pizza fries burger"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="relative py-24 bg-gradient-to-b from-gray-50 to-orange-50">
        <h2 className="text-3xl font-semibold text-center mb-16">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 px-10 max-w-6xl mx-auto">

          {/* STEP 1 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border-t-4 border-orange-500 relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="font-semibold">Browse Restaurants</h3>
            <p className="text-sm text-gray-400 mt-2">
              Explore restaurants near you
            </p>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
              1
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border-t-4 border-orange-500 relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="font-semibold">Add to Cart</h3>
            <p className="text-sm text-gray-400 mt-2">
              Select and customize your order
            </p>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
              2
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border-t-4 border-orange-500 relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
              className="w-20 mx-auto mb-4"
            />
            <h3 className="font-semibold">Order Placed</h3>
            <p className="text-sm text-gray-400 mt-2">
              We prepare and confirm your order
            </p>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-10 h-10 flex items-center justify-center rounded-full">
              3
            </div>
          </div>

        </div>
      </div>

      {/* AUTH USER DATA */}
      {isLoggedIn && (
        <>
          {/* DISHES */}
          <div className="px-10 py-12">
            <h2 className="text-xl mb-8">What's on your mind?</h2>

            <div className="grid grid-cols-5 gap-6">
              {allDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() =>
                    navigate(`/restaurants?dishId=${dish.id}`)
                  }
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-3xl">
                    {dish.isVeg ? "🟢" : "🔴"}
                  </div>
                  <p className="text-sm font-medium">{dish.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RESTAURANTS */}
          <div ref={restaurantsRef} className="px-10 py-12">
            <h2 className="text-xl mb-8">Restaurants</h2>

            <div className="grid grid-cols-3 gap-6">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-2xl p-5 hover:shadow-md cursor-pointer"
                >
                  <div className="h-28 bg-orange-50 rounded-xl flex items-center justify-center text-4xl mb-4">
                    🍽
                  </div>
                  <p className="font-medium">{r.name}</p>
                  <button
                    onClick={() =>
                      navigate(`/restaurant/${r.id}/menu`)
                    }
                    className="text-orange-500 text-sm mt-2"
                  >
                    View Menu →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;