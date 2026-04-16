import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  attachMenuItemToRestaurant,
  getAllMenuItems,
  getRestaurantMenu,
} from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const AddDishes = () => {


  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");

  const [dish, setDish] = useState({
    menuItemId: "",
    price: "",
    isAvailable: "true",
  });

  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoadingMenu(true);
        const response = await getAllMenuItems();
        console.log("Menu Items →", response);
        setMenuItems(response?.data || []);
      } catch (error) {
        console.error("Failed to load menu items →", error);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchRestaurantDishes = async () => {
      if (!restaurantId) return;

      try {
        setLoadingDishes(true);
        const response = await getRestaurantMenu(restaurantId);
        console.log("Restaurant Dishes →", response);
        setDishes(response?.data || response?.data || []);
      } catch (error) {
        console.error("Failed to load restaurant dishes →", error);
      } finally {
        setLoadingDishes(false);
      }
    };

    fetchRestaurantDishes();
  }, [restaurantId]);

  const validate = () => {
    let newErrors = {};
    if (!dish.menuItemId) newErrors.menuItemId = "Please select a dish";
    if (!dish.price) newErrors.price = "Price is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", apiError: "" });
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        restaurantId: Number(restaurantId),
        menuItemId: Number(dish.menuItemId),
        price: Number(dish.price),
        isAvailable: dish.isAvailable === "true",
      };

      console.log("Attach Payload →", payload);

      await attachMenuItemToRestaurant(payload);

      const refreshedMenu = await getRestaurantMenu(restaurantId);
      setDishes(refreshedMenu?.data || refreshedMenu?.data?.data || []);

      setDish({
        menuItemId: "",
        price: "",
        isAvailable: "true",
      });
    } catch (error) {
      console.error("Attach Dish Error →", error);
      setErrors({
        apiError:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to attach dish",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ✅ UPDATED NAVBAR */}
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-medium mb-1">
          Add <span className="text-orange-500">Dishes</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Add dishes to your restaurant menu
        </p>

     

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <form onSubmit={handleAddDish} className="flex flex-col gap-4">
            <div>
              <select
                name="menuItemId"
                value={dish.menuItemId}
                onChange={handleChange}
                disabled={loadingMenu}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                  ${
                    errors.menuItemId
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-orange-400"
                  }
                  ${loadingMenu ? "text-gray-400" : ""}`}
              >
                <option value="">
                  {loadingMenu ? "Loading dishes..." : "Select Dish"}
                </option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              {errors.menuItemId && (
                <p className="text-red-500 text-xs mt-1">{errors.menuItemId}</p>
              )}
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  name="price"
                  placeholder="Price (₹)"
                  type="number"
                  value={dish.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${
                      errors.price
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-orange-400"
                    }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              <div className="flex-1">
                <select
                  name="isAvailable"
                  value={dish.isAvailable}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400 transition"
                >
                  <option value="true">✅ Available</option>
                  <option value="false">❌ Unavailable</option>
                </select>
              </div>
            </div>

            {errors.apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-500 text-sm">{errors.apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || loadingMenu}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "+ Add Dish"}
            </button>
          </form>
        </div>

        {loadingDishes && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-400">Loading added dishes...</p>
          </div>
        )}

        {!loadingDishes && dishes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-medium mb-4">
              Added ({dishes.length} dishes)
            </h2>

            <div className="flex flex-col">
              {dishes.map((d) => (
                <div
                  key={d.id || d.menuItemId}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{d.name}</p>

                    {(d.isAvailable === false || d.isAvailable === "false") && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-orange-500">
                    ₹{d.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDishes;