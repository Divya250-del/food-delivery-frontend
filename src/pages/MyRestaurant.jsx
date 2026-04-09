import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyRestaurant = () => {
  const role = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  const restaurant = JSON.parse(localStorage.getItem("restaurant") || "null");
  const [dishes, setDishes] = useState(() =>
    JSON.parse(localStorage.getItem("dishes") || "[]")
  );

  const [editingDish, setEditingDish] = useState(null);
  const [editForm, setEditForm] = useState({});

  // ── Delete dish ──
  const handleDelete = (id) => {
    const updated = dishes.filter((d) => d.id !== id);
    setDishes(updated);
    localStorage.setItem("dishes", JSON.stringify(updated));
  };

  // ── Open edit modal ──
  const handleEditClick = (dish) => {
    setEditingDish(dish.id);
    setEditForm({ ...dish });
  };

  // ── Save edited dish ──
  const handleEditSave = () => {
    const updated = dishes.map((d) => (d.id === editingDish ? { ...editForm } : d));
    setDishes(updated);
    localStorage.setItem("dishes", JSON.stringify(updated));
    setEditingDish(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ── No restaurant created yet ──
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar isLoggedIn={isLoggedIn} role={role} />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
          <p className="text-gray-400 text-sm">You haven't created a restaurant yet.</p>
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
      <Navbar isLoggedIn={isLoggedIn} role={role} />

      <div className="max-w-2xl mx-auto px-4 py-12">

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
            <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
              Active
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
            onClick={() => navigate("/add-dishes")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            + Add Dish
          </button>
        </div>

        {/* No Dishes */}
        {dishes.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-gray-400 text-sm">No dishes added yet.</p>
          </div>
        )}

        {/* Dishes List */}
        {dishes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-0">
            {dishes.map((d) => (
              <div key={d.id}>
                {editingDish === d.id ? (
                  // ── Edit Mode ──
                  <div className="py-4 flex flex-col gap-3 border-b border-gray-50">
                    <div className="flex gap-3">
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Dish Name"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                      />
                      <input
                        name="price"
                        type="number"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                        className="w-24 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                      />
                    </div>
                    <input
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      placeholder="Description"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                    />
                    <div className="flex gap-3">
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                      >
                        <option value="Starter">Starter</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Drinks">Drinks</option>
                      </select>
                      <select
                        name="isVeg"
                        value={editForm.isVeg}
                        onChange={handleEditChange}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                      >
                        <option value="true">🟢 Veg</option>
                        <option value="false">🔴 Non-Veg</option>
                      </select>
                      <select
                        name="isAvailable"
                        value={editForm.isAvailable}
                        onChange={handleEditChange}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400"
                      >
                        <option value="true">✅ Available</option>
                        <option value="false">❌ Unavailable</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSave}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDish(null)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // ── View Mode ──
                  <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{d.name}</p>
                        <span className="text-xs">{d.isVeg === "true" ? "🟢" : "🔴"}</span>
                        {d.isAvailable === "false" && (
                          <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {d.category}{d.description && ` • ${d.description}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-orange-500">₹{d.price}</p>
                      <button
                        onClick={() => handleEditClick(d)}
                        className="text-xs text-gray-400 hover:text-orange-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRestaurant;