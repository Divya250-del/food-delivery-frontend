import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Signup() {
  const navigate = useNavigate();

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
      const response = await registerUser(formData);
      console.log("Signup Success:", response);
      navigate("/signin");
    } catch (error) {
      setErrors({
        apiError:
          error?.error?.message || error?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">

        {/* Logo */}
        <h1 className="text-center text-2xl font-medium mb-1">
          <span className="text-orange-500">Food</span>ie
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.email
                  ? "border-red-400 bg-red-50 focus:border-red-400"
                  : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.name
                  ? "border-red-400 bg-red-50 focus:border-red-400"
                  : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.phone
                  ? "border-red-400 bg-red-50 focus:border-red-400"
                  : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                ${errors.password
                  ? "border-red-400 bg-red-50 focus:border-red-400"
                  : "border-gray-200 focus:border-orange-400"}`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* API Error */}
          {errors.apiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-500 text-sm">{errors.apiError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Sign in link */}
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