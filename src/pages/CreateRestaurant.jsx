import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createRestaurant } from "../api/authApi";
import { useAuth } from "../context/AuthContext"; // ✅ NEW

const CreateRestaurant = () => {
  const navigate = useNavigate();


  // ✅ USE CONTEXT
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Restaurant name is required";
    if (!formData.address) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
      };

      console.log("Payload →", payload);

      const response = await createRestaurant(payload);
      console.log("Response →", response);

      const restaurantId = response?.data?.id;

      if (restaurantId) {
        localStorage.setItem("restaurantId", restaurantId);
      }

      setSuccess(true);

      setTimeout(() => {
        if (restaurantId) {
          navigate(`/add-dishes?restaurantId=${restaurantId}`);
        } else {
          navigate("/add-dishes");
        }
      }, 1500);

    } catch (error) {
      console.error("API Error →", error);
      setErrors({
        apiError:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create restaurant",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">

      {/* ✅ UPDATED NAVBAR */}
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-lg p-8">
          <h1 className="text-2xl font-medium mb-1">
            Create <span className="text-orange-500">Restaurant</span>
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Fill in the details to list your restaurant
          </p>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-green-600 text-sm">
                Restaurant created! Redirecting to add dishes...
              </p>
            </div>
          )}

          {errors.apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-red-500 text-sm">{errors.apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <input
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                  ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400 transition resize-none"
              />
            </div>

            <div>
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                  ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating..." : "Create & Add Dishes →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurant;