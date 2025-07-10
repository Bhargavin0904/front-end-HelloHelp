import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";

function AddAgent({ form, onChange, onAgentAdded, onClose }) {
  const [formData, setFormData] = useState(form);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleanedPhone = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: cleanedPhone }));
      onChange({ target: { name, value: cleanedPhone } });
    } else if (name === "country_code") {
      const cleanedCode = value.replace(/[^\d+]/g, "").slice(0, 5);
      setFormData((prev) => ({ ...prev, [name]: cleanedCode }));
      onChange({ target: { name, value: cleanedCode } });
    } else if (name === "password") {
      // update form and validate password
      setFormData((prev) => ({ ...prev, [name]: value }));
      validatePassword(value);
      onChange(e);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      onChange(e);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, user_lastname, email, phone, password } = formData;

    if (!username || !user_lastname || !email || !phone || !password) {
      alert("Please fill all fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\+?\d{1,5}$/.test(formData.country_code)) {
      alert("Enter a valid country code, like +91 or 1.");
      return;
    }
    const { length, uppercase, lowercase, special } = passwordValidation;
    if (!length || !uppercase || !lowercase || !special) {
      alert("Password does not meet the required conditions.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://lemonpeak-hellohelp-backend.onrender.com/api/auth/register",
        {
          username,
          user_lastname,
          email,
          country_code: formData.country_code,
          phone,
          password,
          is_agent: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (onAgentAdded) onAgentAdded();
      if (onClose) onClose();
    } catch (error) {
      alert("Failed to add agent.");
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <MDBox pt={3} px={3}>
          <MDInput
            type="text"
            label="First Name"
            name="username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            inputProps={{ maxLength: 50 }}
            margin="normal"
          />
          <MDInput
            type="text"
            label="Last Name"
            name="user_lastname"
            fullWidth
            value={formData.user_lastname}
            onChange={handleChange}
            inputProps={{ maxLength: 50 }}
            margin="normal"
          />
          <MDInput
            type="email"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            inputProps={{ maxLength: 50 }}
            margin="normal"
          />
          <MDInput
            type="tel"
            label="Country Code"
            name="country_code"
            fullWidth
            value={formData.country_code}
            onChange={handleChange}
            inputProps={{ maxLength: 5 }}
            margin="normal"
          />
          <MDInput
            type="tel"
            label="Phone Number"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            inputProps={{ maxLength: 10 }}
            margin="normal"
          />
          <MDInput
            type="password"
            label="Password"
            name="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
            margin="normal"
          />
          <MDBox mt={1} mb={2} color="text.secondary">
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ color: passwordValidation.length ? "green" : "red" }}>
                Minimum 8 characters
              </li>
              <li style={{ color: passwordValidation.uppercase ? "green" : "red" }}>
                At least 1 uppercase letter
              </li>
              <li style={{ color: passwordValidation.lowercase ? "green" : "red" }}>
                At least 1 lowercase letter
              </li>
              <li style={{ color: passwordValidation.number ? "green" : "red" }}>
                At least 1 number
              </li>
              <li style={{ color: passwordValidation.special ? "green" : "red" }}>
                At least 1 special character
              </li>
            </ul>
          </MDBox>

          <MDBox mt={3} mb={2} display="flex" justifyContent="space-between">
            <MDButton type="submit" variant="gradient" color="info">
              Add
            </MDButton>
            <MDButton variant="outlined" color="error" onClick={onClose}>
              Cancel
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </form>
  );
}

AddAgent.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAgentAdded: PropTypes.func,
  onClose: PropTypes.func,
};

export default AddAgent;
