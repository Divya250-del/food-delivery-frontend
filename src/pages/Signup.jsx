import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // ✅ Validation (production-style basic validation)
  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // remove field error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
      apiError: "",
    });
  };

  // ✅ Handle Submit (API Integration)
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

      // ✅ redirect after success
      navigate("/signin");

    } catch (error) {
      console.error("Signup Error:", error);

      setErrors({
        apiError:
          error?.error?.message || // your ApiResponse format
          error?.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <input
            className={`input-field ${errors.email ? "input-error" : ""}`}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          {/* Name */}
          <input
            className={`input-field ${errors.name ? "input-error" : ""}`}
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          {/* Phone */}
          <input
            className={`input-field ${errors.phone ? "input-error" : ""}`}
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          {/* Password */}
          <input
            type="password"
            className={`input-field ${errors.password ? "input-error" : ""}`}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          {/* API Error */}
          {errors.apiError && <p className="error">{errors.apiError}</p>}

          {/* Button */}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;