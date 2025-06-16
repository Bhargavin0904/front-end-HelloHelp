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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import team2 from "assets/images/team-2.jpg";
import axios from "axios";

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setCustomer(null);
      return;
    }
    axios
      .get("https://lemonpeak-hellohelp-backend.onrender.com/api/customer/customers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        const found = data.find((c) => String(c.id) === String(id));
        setCustomer(found || null);
        setLoading(false);
      })
      .catch(() => {
        setCustomer(null);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (!customer)
    return (
      <Typography align="center" mt={4}>
        Customer not found
      </Typography>
    );

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, borderRadius: 3, background: "#f5f7fa" }}>
      <Box>
        {/* Top Buttons */}
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
            onClick={() => navigate(`/customer/${id}/edit`)}
            sx={{
              fontWeight: 600,
              color: "white",
              "& .MuiButton-startIcon": { color: "white" },
            }}
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
            // src={team2}
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
            {customer.username}
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
        {/* Info Card */}
        {/* <Paper
          elevation={2}
          sx={{
            mt: 2,
            mx: "auto",
            p: 4,
            maxWidth: 920,
            borderRadius: 1,
            background: "#fff",
          }}
        > */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom align="center">
          Profile Information
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            mt: 1,
            maxWidth: 920,
            mx: "auto",
            alignItems: "stretch", // Important!
          }}
        >
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
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Email:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.email || "N/A"}
                </Typography>
              </Box>
              {/* <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Country Code:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.country_code || "N/A"}
                </Typography>
              </Box> */}
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Mobile:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.phone || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Landline Number:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.landline_number || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Address Line1:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.address_line1 || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Address Line2:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.address_line2 || "N/A"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                height: "100%",
              }}
            >
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Zip Code:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.zip_code || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 90 }}>
                  State:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.state || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 90 }}>
                  Country:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.country || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Tv Provider Account Number:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.tv_provider_account_number || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Internet Provider Account Number:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.internet_provider_account_number || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <Typography color="text.secondary" sx={{ fontSize: "0.95rem", minWidth: 80 }}>
                  Wireless Provider Account Number:
                </Typography>
                <Typography sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  {customer.wireless_provider_account_number || "N/A"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {/* </Paper> */}
      </Box>
    </Card>
  );
}
