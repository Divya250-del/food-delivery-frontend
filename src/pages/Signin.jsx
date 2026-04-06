import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });



  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or Phone is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

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

    console.log("Login Data:", formData);
    

    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Sign In</h2>

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
            type="password"
            className={`input-field ${errors.password ? "input-error" : ""}`}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Signin;