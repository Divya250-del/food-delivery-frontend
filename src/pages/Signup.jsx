import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or Phone is required";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // remove error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Signup Data:", formData);

    navigate("/signin");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            className={`input-field ${errors.emailOrPhone ? "input-error" : ""}`}
            name="emailOrPhone"
            placeholder="Email or Phone"
            value={formData.emailOrPhone}
            onChange={handleChange}
          />
          {errors.emailOrPhone && <p className="error">{errors.emailOrPhone}</p>}

          <input
            className={`input-field ${errors.username ? "input-error" : ""}`}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}

          <input
            type="password"
            className={`input-field ${errors.password ? "input-error" : ""}`}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button className="btn btn-primary">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;