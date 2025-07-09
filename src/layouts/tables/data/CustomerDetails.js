import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Paper,
  Grid,
  Card,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import PropTypes from "prop-types";

const isValidUSPhone = (number) =>
  /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test(number);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("customer_data");
    if (stored) {
      setCustomer(JSON.parse(stored));
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setCustomer(null);
      return;
    }

    axios
      .get("http://54.226.150.175:3000/api/customer/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        const found = data.find((c) => String(c.id) === String(id));
        if (found) {
          setCustomer(found);
          localStorage.setItem("customer_data", JSON.stringify(found));
        } else {
          setCustomer(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setCustomer(null);
        setLoading(false);
      });
  }, [id]);

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { email, landline_number } = editData;

    if (!isValidEmail(email)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    if (editData.phone && !isValidUSPhone(editData.phone)) {
      alert("❌ Mobile number must be a valid 10-digit US number.");
      return;
    }

    if (landline_number && !isValidUSPhone(landline_number)) {
      alert("❌ Landline number must be a valid 10-digit US number.");
      return;
    }

    try {
      const response = await axios.patch(
        "http://54.226.150.175:3000/api/auth/update-profile",
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.message === "Profile updated successfully") {
        alert("✅ Customer Profile updated!");
        const updatedCustomer = { ...customer, ...editData };
        setCustomer(updatedCustomer);
        localStorage.setItem("customer_data", JSON.stringify(updatedCustomer));
        setOpenEditDialog(false);
      } else {
        alert("⚠️ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Error updating profile.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Typography align="center" mt={4}>
        Customer not found
      </Typography>
    );
  }

  return (
    <Card sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2, borderRadius: 3, background: "#f5f7fa" }}>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="info"
            startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
            onClick={() => navigate(-1)}
            sx={{ fontWeight: 600 }}
          >
            Back to Customers List
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditData(customer);
              setOpenEditDialog(true);
            }}
            sx={{
              fontWeight: 600,
              color: "white",
              "& .MuiButton-startIcon": { color: "white" },
            }}
          >
            Edit Profile
          </Button>
        </Stack>

        <Box
          sx={{
            width: "100%",
            height: 100,
            background: "#000E29",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            position: "relative",
            borderRadius: 2,
          }}
        >
          <Avatar
            sx={{
              width: 130,
              height: 130,
              border: "5px solid #fff",
              background: "#000E29",
              position: "absolute",
              bottom: -65,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 60,
              boxShadow: 3,
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: "#222" }}>
            {customer.username?.charAt(0).toUpperCase() + customer.username?.slice(1)}
          </Typography>
          <Box
            sx={{
              mt: 1,
              px: 2,
              py: 0.5,
              background: "#e3f0fc",
              borderRadius: "20px",
              display: "inline-block",
            }}
          >
            <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: 600 }}>
              Customer
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom align="center">
          Profile Information
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1, maxWidth: 920, mx: "auto" }}>
          {/* Left Card */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                height: "100%",
              }}
            >
              <DetailRow label="Email" value={customer.email} />
              <DetailRow label="Country Code" value={customer.country_code} />
              <DetailRow label="Mobile" value={customer.phone} />
              <DetailRow label="Landline Number" value={customer.landline_number} />
              <DetailRow label="Address Line1" value={customer.address_line1} />
              <DetailRow label="Address Line2" value={customer.address_line2} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper
              elevation={1}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                height: "100%",
              }}
            >
              <DetailRow label="Zip Code" value={customer.zip_code} />
              <DetailRow label="State" value={customer.state} />
              <DetailRow label="Country" value={customer.country} />
              <DetailRow
                label="TV Provider Account Number"
                value={customer.tv_provider_account_number}
              />
              <DetailRow
                label="Internet Provider Account Number"
                value={customer.internet_provider_account_number}
              />
              <DetailRow
                label="Wireless Provider Account Number"
                value={customer.wireless_provider_account_number}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Customer Details</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="First Name" value={editData.username || ""} fullWidth disabled />
            <TextField
              label="Last Name"
              value={editData.user_lastname || ""}
              fullWidth
              inputProps={{ maxLength: 25 }}
              onChange={(e) => setEditData({ ...editData, user_lastname: e.target.value })}
            />
            <TextField
              label="Country Code"
              value={editData.country_code || ""}
              fullWidth
              inputProps={{
                maxLength: 5,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={(e) => setEditData({ ...editData, country_code: e.target.value })}
            />
            <TextField label="Phone" value={editData.phone || ""} fullWidth disabled />
            <TextField
              label="Email"
              value={editData.email || ""}
              fullWidth
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <TextField
              label="Landline Number"
              value={editData.landline_number || ""}
              fullWidth
              inputProps={{
                maxLength: 15,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={(e) => setEditData({ ...editData, landline_number: e.target.value })}
            />
            <TextField
              label="Address Line 1"
              value={editData.address_line1 || ""}
              fullWidth
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setEditData({ ...editData, address_line1: e.target.value })}
            />
            <TextField
              label="Address Line 2"
              value={editData.address_line2 || ""}
              fullWidth
              inputProps={{ maxLength: 50 }}
              onChange={(e) => setEditData({ ...editData, address_line2: e.target.value })}
            />
            <TextField
              label="Zip Code"
              value={editData.zip_code || ""}
              fullWidth
              inputProps={{
                maxLength: 10,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              onChange={(e) => setEditData({ ...editData, zip_code: e.target.value })}
            />
            <TextField
              label="State"
              value={editData.state || ""}
              fullWidth
              inputProps={{ maxLength: 15 }}
              onChange={(e) => setEditData({ ...editData, state: e.target.value })}
            />
            <TextField
              label="Country"
              value={editData.country || ""}
              fullWidth
              inputProps={{ maxLength: 15 }}
              onChange={(e) => setEditData({ ...editData, country: e.target.value })}
            />
            <TextField
              label="TV Provider Account Number"
              value={editData.tv_provider_account_number || ""}
              fullWidth
              inputProps={{ maxLength: 12 }}
              onChange={(e) =>
                setEditData({ ...editData, tv_provider_account_number: e.target.value })
              }
            />
            <TextField
              label="Internet Provider Account Number"
              value={editData.internet_provider_account_number || ""}
              fullWidth
              inputProps={{ maxLength: 12 }}
              onChange={(e) =>
                setEditData({ ...editData, internet_provider_account_number: e.target.value })
              }
            />
            <TextField
              label="Wireless Provider Account Number"
              value={editData.wireless_provider_account_number || ""}
              fullWidth
              inputProps={{ maxLength: 12 }}
              onChange={(e) =>
                setEditData({ ...editData, wireless_provider_account_number: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleProfileUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

const DetailRow = ({ label, value }) => (
  <Box display="flex" gap={1} alignItems="center" mb={1}>
    <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 150 }}>
      {label}:
    </Typography>
    <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>{value || "-"}</Typography>
  </Box>
);

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
