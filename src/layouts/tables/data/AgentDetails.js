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

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setAgent(null);
      return;
    }
    axios
      .get("http://54.226.150.175:3000/api/agent/agents ", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        const found = data.find((a) => String(a.id) === String(id));
        setAgent(found || null);
        setLoading(false);
      })
      .catch(() => {
        setAgent(null);
        setLoading(false);
      });
  }, [id]);

  const handleAgentUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
        alert("✅ Agent profile updated!");
        const updatedAgent = { ...agent, ...editData };
        setAgent(updatedAgent);
        setOpenEditDialog(false);
      } else {
        alert("⚠️ Update failed.");
      }
    } catch (err) {
      console.error("Agent update error:", err);
      alert("❌ Error updating agent.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (!agent)
    return (
      <Typography align="center" mt={4}>
        Agent not found
      </Typography>
    );

  return (
    <Card sx={{ maxWidth: 1000, mx: "auto", mt: 4, p: 2, borderRadius: 3, background: "#f5f7fa" }}>
      <Box>
        {/* Top Buttons */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="info"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ fontWeight: 600, color: "white" }}
          >
            Back to Agents List
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditData(agent);
              setOpenEditDialog(true);
            }}
            sx={{ fontWeight: 600, color: "white" }}
          >
            Edit Profile
          </Button>
        </Stack>

        {/* Blue Cover */}
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

        {/* Name and Role */}
        <Box
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: "#222" }}>
            {agent.username?.charAt(0).toUpperCase() + agent.username?.slice(1)}
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
              {agent.role || "Agent"}
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
              {" "}
              <DetailRow label="First Name" value={agent.username} />
              <DetailRow label="Last Name" value={agent.user_lastname} />
              <DetailRow label="Email" value={agent.email} />
              <DetailRow label="Country Code" value={agent.country_code} />
              <DetailRow label="Mobile" value={agent.phone} />
              <DetailRow label="Landline Number" value={agent.landline_number} />
              <DetailRow label="Address Line1" value={agent.address_line1} />
            </Paper>
          </Grid>

          {/* Right Card */}
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
              {" "}
              <DetailRow label="Address Line2" value={agent.address_line2} />
              <DetailRow label="Zip Code" value={agent.zip_code} />
              <DetailRow label="State" value={agent.state} />
              <DetailRow label="Country" value={agent.country} />
              <DetailRow
                label="TV Provider Account Number"
                value={agent.tv_provider_account_number}
              />
              <DetailRow
                label="Internet Provider Account Number"
                value={agent.internet_provider_account_number}
              />
              <DetailRow
                label="Wireless Provider Account Number"
                value={agent.wireless_provider_account_number}
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
        <DialogTitle>Edit Agent Details</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="First Name"
              value={editData.username || ""}
              fullWidth
              // InputProps={{ readOnly: true }}
              disabled
            />
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
            <TextField
              label="Phone"
              value={editData.phone || ""}
              fullWidth
              // InputProps={{ readOnly: true }}
              disabled
            />
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
          <Button variant="contained" onClick={handleAgentUpdate}>
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
