import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const RESTAURANTS = [
  { id: 1, name: "Pizza Palace", cuisine: "Italian", rating: "4.5★", delivery: "25 min", emoji: "🍕", dishes: ["Pizza", "Sandwich"] },
  { id: 2, name: "Burger Barn", cuisine: "American", rating: "4.3★", delivery: "20 min", emoji: "🍔", dishes: ["Burger", "Shake"] },
  { id: 3, name: "Noodle House", cuisine: "Asian", rating: "4.7★", delivery: "30 min", emoji: "🍜", dishes: ["Ramen", "Sushi"] },
  { id: 4, name: "Spice Garden", cuisine: "Indian", rating: "4.6★", delivery: "35 min", emoji: "🍛", dishes: ["Biryani"] },
  { id: 5, name: "Taco Town", cuisine: "Mexican", rating: "4.2★", delivery: "22 min", emoji: "🌮", dishes: ["Tacos"] },
  { id: 6, name: "Sushi Stop", cuisine: "Japanese", rating: "4.8★", delivery: "40 min", emoji: "🍣", dishes: ["Sushi", "Salad"] },
  { id: 7, name: "Sweet Treats", cuisine: "Desserts", rating: "4.4★", delivery: "15 min", emoji: "🎂", dishes: ["Cake", "Shake"] },
  { id: 8, name: "Green Bowl", cuisine: "Healthy", rating: "4.5★", delivery: "20 min", emoji: "🥗", dishes: ["Salad", "Sandwich"] },
];

const RestaurantsByDish = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ❌ REMOVE localStorage
  // const role = localStorage.getItem("role");
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const dish = searchParams.get("dish");

  const filtered = dish
    ? RESTAURANTS.filter((r) => r.dishes.includes(dish))
    : RESTAURANTS;

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ✅ UPDATED NAVBAR */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-orange-500 transition text-sm"
          >
            ← Back
          </button>
        </div>

        <h1 className="text-2xl font-medium mb-1">
          {dish ? (
            <>Restaurants serving <span className="text-orange-500">{dish}</span></>
          ) : (
            <>All <span className="text-orange-500">Restaurants</span></>
          )}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🍽</p>
            <p className="text-gray-400 text-sm">No restaurants found for "{dish}"</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Restaurant Grid */}
        <div className="grid grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-orange-200 transition cursor-pointer"
            >
              <div className="w-full h-28 bg-orange-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                {r.emoji}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.cuisine}</p>
                </div>
                <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                  {r.rating}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">🕐 {r.delivery}</p>
                <button className="text-xs text-orange-500 font-medium hover:underline">
                  View Menu →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantsByDish;