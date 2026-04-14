import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getRestaurantMenu, addToCart,getCart,getMyRestaurants } from "../api/authApi";

const RestaurantMenu = () => {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const { restaurantId } = useParams();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [myrestaurant, setMyRestaurant] = useState(null);


  const fetchMyRestaurant = async () => {
      try {
        const res = await getMyRestaurants();
        const data = res?.data?.[0] || null;
        setMyRestaurant(data);
      } catch (err) {
        console.error(err);
      }
    }


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
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantMenu(restaurantId);
        console.log("Restaurant Menu →", response);

        setMenu(response?.data  || []);
      } catch (err) {
        console.error("Failed to load menu →", err);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
      fetchCartCount();
      fetchMyRestaurant();
    }
  }, [restaurantId]);

  const handleAddToCart = async (dish) => {
  try {
    const payload = {
      restaurantId: Number(restaurantId),
      menuItemId: Number(dish.id || dish.menuItemId),
      name: dish.name,
      price: Number(dish.price),
      quantity: 1,
    };

    console.log("Add to cart payload →", payload);

    const response = await addToCart(payload);
    console.log("Cart response →", response);

    alert("Item added to cart ✅");

  } catch (error) {
    console.error("Add to cart error →", error);

    if (error?.response?.status === 401) {
      alert("Please login first ❌");
    } else {
      alert("Failed to add item");
    }
  }
};

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar isLoggedIn={isLoggedIn} role={role} restaurant={myrestaurant} cartCount={cartCount}/>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-medium mb-2">
          Restaurant <span className="text-orange-500">Menu</span>
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          Dishes available in this restaurant
        </p>

        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">Loading menu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && menu.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No dishes found for this restaurant.</p>
          </div>
        )}

        {!loading && !error && menu.length > 0 && (
          <div className="grid grid-cols-2 gap-5">
            {menu.map((dish) => (
              <div
                key={dish.id || dish.menuItemId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-medium">{dish.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {dish.description || "No description"}
                    </p>
                  </div>

                  <span className="text-lg">
                    {dish.isVeg ? "🟢" : "🔴"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <p className="text-orange-500 font-medium">
                    ₹{dish.price ?? "--"}
                  </p>

                  {(dish.isAvailable === false || dish.isAvailable === "false") ? (
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">
                      Unavailable
                    </span>
                  ) : (
                    <button
                    onClick={() => handleAddToCart(dish)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition"
                    >
                    Add to Cart
                    </button>                  
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenu;