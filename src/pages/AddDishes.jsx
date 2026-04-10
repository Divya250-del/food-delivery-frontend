import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addDish } from "../api/authApi";

const AddDishes = () => {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [searchParams] = useSearchParams();

  // get restaurantId from URL or localStorage
  const restaurantId = localStorage.getItem("restaurantId");

  const [dish, setDish] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isVeg: "",
    isAvailable: "true",
  });
  const [dishes, setDishes] = useState(() => {
    return JSON.parse(localStorage.getItem("dishes") || "[]");
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!dish.name) newErrors.name = "Dish name is required";
    if (!dish.price) newErrors.price = "Price is required";
    if (!dish.category) newErrors.category = "Category is required";
    if (dish.isVeg === "") newErrors.isVeg = "Please select Veg or Non-Veg";
    return newErrors;
  };

  const handleChange = (e) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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

      // ✅ Exact payload matching your Postman
      const payload = {
        name: dish.name,
        description: dish.description,
        price: Number(dish.price),         // backend expects number not string
        isVeg: dish.isVeg === "true",      // backend expects boolean not string
        isAvailable: dish.isAvailable === "true",
        restaurantId:restaurantId
      };

      console.log("Dish Payload →", payload);

      const response = await addDish(payload);
      console.log("Dish Response →", response);

      // save to localStorage for MyRestaurant page
      const newDish = { ...payload, id: response?.data?.id || Date.now(), category: dish.category };
      const existingDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
      const updatedDishes = [...existingDishes, newDish];
      localStorage.setItem("dishes", JSON.stringify(updatedDishes));
      setDishes(updatedDishes);

      // reset form
      setDish({ name: "", description: "", price: "", category: "", isVeg: "", isAvailable: "true" });

    } catch (error) {
      console.error("Add Dish Error →", error);
      setErrors({
        apiError:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add dish",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar isLoggedIn={isLoggedIn} role={role} />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-medium mb-1">
          Add <span className="text-orange-500">Dishes</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Add dishes to your restaurant menu
        </p>

        {/* Add Dish Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <form onSubmit={handleAddDish} className="flex flex-col gap-4">

            {/* Dish Name */}
            <div>
              <input
                name="name"
                placeholder="Dish Name"
                value={dish.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                  ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={dish.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400 transition resize-none"
              />
            </div>

            {/* Price & Category */}
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  name="price"
                  placeholder="Price (₹)"
                  type="number"
                  value={dish.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${errors.price ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              <div className="flex-1">
                <select
                  name="category"
                  value={dish.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${errors.category ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
                >
                  <option value="">Category</option>
                  <option value="Starter">Starter</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drinks">Drinks</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* isVeg & isAvailable */}
            <div className="flex gap-3">
              <div className="flex-1">
                <select
                  name="isVeg"
                  value={dish.isVeg}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${errors.isVeg ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
                >
                  <option value="">Veg / Non-Veg</option>
                  <option value="true">🟢 Veg</option>
                  <option value="false">🔴 Non-Veg</option>
                </select>
                {errors.isVeg && <p className="text-red-500 text-xs mt-1">{errors.isVeg}</p>}
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

            {/* API Error */}
            {errors.apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-500 text-sm">{errors.apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "+ Add Dish"}
            </button>
          </form>
        </div>

        {/* Dishes List */}
        {dishes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-medium mb-4">
              Menu ({dishes.length} dishes)
            </h2>
            <div className="flex flex-col gap-3">
              {dishes.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{d.name}</p>
                      <span className="text-xs">{d.isVeg === true || d.isVeg === "true" ? "🟢" : "🔴"}</span>
                      {(d.isAvailable === false || d.isAvailable === "false") && (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {d.category}{d.description && ` • ${d.description}`}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-orange-500">₹{d.price}</p>
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