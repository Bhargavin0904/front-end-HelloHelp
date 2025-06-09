import { useState } from "react";
import { TextField, Button, Grid, Snackbar, Alert, Card, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";

function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleSend = async () => {
    if (!title || !message || !userId) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setSending(true);

      const payload = {
        user_id: Number(userId),
        title,
        body: message,
        data: {
          custom_key: "custom_value",
        },
      };

      const token = localStorage.getItem("token");

      console.log("Sending payload:", payload);

      const response = await axios.post(
        "https://hellohelp-update-backend.onrender.com/api/admin/push-notification",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbar({ open: true, severity: "success", message: "Notification sent!" });
      setTitle("");
      setMessage("");
      setUserId("");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={5} mb={25}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card sx={{ p: 5, borderRadius: 3, boxShadow: 5 }}>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                mt={-7}
                py={3}
                px={3}
                mb={2}
                // sx={{ minHeight: "300px" }}
              >
                <MDTypography variant="h5" color="white">
                  🚀 Push Notification
                </MDTypography>
              </MDBox>

              <Stack spacing={3}>
                <TextField
                  label="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  fullWidth
                  type="number"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#2e2e3e" : "#f9f9f9",
                    },
                  }}
                />
                <TextField
                  label="Notification Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#2e2e3e" : "#f9f9f9",
                    },
                  }}
                />
                <TextField
                  label="Notification Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#2e2e3e" : "#f9f9f9",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={sending}
                  sx={{
                    mt: 2,
                    background: "linear-gradient(to right, #00c6ff, #0072ff)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {sending ? "Sending..." : "Send Notification"}
                </Button>
              </Stack>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  severity={snackbar.severity}
                  onClose={() => setSnackbar({ ...snackbar, open: false })}
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
