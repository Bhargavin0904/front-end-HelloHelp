// import React from "react";
// import PropTypes from "prop-types";
// import { DialogContent, TextField, DialogActions, Button } from "@mui/material";

// export default function AddAgent({ form, onChange, onSubmit, onCancel }) {
//   return (
//     <form onSubmit={onSubmit}>
//       <DialogContent>
//         <TextField
//           margin="dense"
//           label="Username"
//           name="username"
//           fullWidth
//           required
//           value={form.username}
//           onChange={onChange}
//         />
//         <TextField
//           margin="dense"
//           label="Email"
//           name="email"
//           type="email"
//           fullWidth
//           required
//           value={form.email}
//           onChange={onChange}
//         />
//         <TextField
//           margin="dense"
//           label="Phone No"
//           name="phone"
//           fullWidth
//           required
//           value={form.phone}
//           onChange={onChange}
//         />
//         <TextField
//           margin="dense"
//           label="Department"
//           name="department"
//           fullWidth
//           required
//           value={form.department}
//           onChange={onChange}
//         />
//         <TextField
//           margin="dense"
//           label="Location"
//           name="location"
//           fullWidth
//           required
//           value={form.location}
//           onChange={onChange}
//         />
//       </DialogContent>
//       {/* <DialogActions>
//             <Button onClick={onCancel}>Cancel</Button>
//             <Button type="submit" variant="contained" color="info">
//             Add
//             </Button>
//         </DialogActions> */}
//     </form>
//   );
// }

// AddAgent.propTypes = {
//   form: PropTypes.shape({
//     username: PropTypes.string,
//     email: PropTypes.string,
//     phone: PropTypes.string,
//     department: PropTypes.string,
//     location: PropTypes.string,
//   }).isRequired,
//   onChange: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func,
//   onCancel: PropTypes.func,
// };

import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// import CoverLayout from "layouts/authentication/components/CoverLayout";
// import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import React, { useState } from "react";
import axios from "axios";
// import { Add } from "@mui/icons-material";
import PropTypes from "prop-types";

function AddAgent({ form, onChange, onAgentAdded, onClose }) {
  const [formData, setFormData] = useState(form);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleanedPhone = value.replace(/\D/g, "").slice(0, 10); // digits only, max 10
      setFormData((prev) => ({
        ...prev,
        [name]: cleanedPhone,
      }));
      onChange({ target: { name, value: cleanedPhone } });
    } else if (name === "country_code") {
      const cleanedCode = value.replace(/[^\d+]/g, "").slice(0, 5); // allow '+' and digits only, max 5
      setFormData((prev) => ({
        ...prev,
        [name]: cleanedCode,
      }));
      onChange({ target: { name, value: cleanedCode } });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      onChange(e);
    }
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

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://54.226.150.175:3000/api/auth/register",
        {
          username,
          user_lastname,
          email,
          country_code: formData.country_code, // FIXED
          phone,
          password,
          is_agent: true, // boolean instead of string if your backend expects it
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // alert("Agent added successfully!");
      if (onAgentAdded) onAgentAdded();
      if (onClose) onClose();
    } catch (error) {
      // console.error("Add agent error:", error.response?.data || error.message);
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
            margin="normal"
          />
          <MDInput
            type="text"
            label="Last Name"
            name="user_lastname"
            fullWidth
            value={formData.user_lastname}
            onChange={handleChange}
            margin="normal"
          />
          <MDInput
            type="email"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
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
            margin="normal"
          />
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
