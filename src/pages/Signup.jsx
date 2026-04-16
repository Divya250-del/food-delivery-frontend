import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer, registerRestaurantOwner } from "../api/authApi";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // "customer" or "owner"
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", apiError: "" });
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
      if (role === "customer") {
        await registerCustomer(formData);
      } else {
        await registerRestaurantOwner(formData);
      }
      navigate("/signin");
    } catch (error) {
      setErrors({
        apiError:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Role Selection ──
  if (!role) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
          <h1 className="text-center text-2xl font-medium mb-1">
            <span className="text-orange-500">Food</span>ie
          </h1>
          <p className="text-center text-gray-400 text-sm mb-8">
            How do you want to join?
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setRole("customer")}
              className="w-full py-4 border-2 border-gray-100 rounded-xl text-left px-5 hover:border-orange-300 hover:bg-orange-50 transition group"
            >
              <p className="text-sm font-medium group-hover:text-orange-500 transition">
                🛒 Join as Customer
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Browse restaurants and order food
              </p>
            </button>

            <button
              onClick={() => setRole("owner")}
              className="w-full py-4 border-2 border-gray-100 rounded-xl text-left px-5 hover:border-orange-300 hover:bg-orange-50 transition group"
            >
              <p className="text-sm font-medium group-hover:text-orange-500 transition">
                🍽 Join as Restaurant Owner
              </p>
              <p className="text-xs text-gray-400 mt-1">
                List your restaurant and manage menu
              </p>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-orange-500 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Step 2: Registration Form ──
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {/* Logo */}
        <h1 className="text-center text-2xl font-medium mb-1">
          <span className="text-orange-500">Food</span>ie
        </h1>
        <p className="text-center text-gray-400 text-sm mb-2">
          {role === "customer" ? "🛒 Customer Account" : "🍽 Restaurant Owner Account"}
        </p>

        {/* Back button */}
        <button
          onClick={() => setRole("")}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition mb-6 mx-auto"
        >
          ← Change role
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {errors.apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-500 text-sm">{errors.apiError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-orange-500 hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;