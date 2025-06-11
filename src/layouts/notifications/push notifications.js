import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Snackbar,
  Alert,
  Card,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import { Checkbox } from "@mui/material";
import data from "layouts/tables/data/CustomerList";

function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [userIds, setUserIds] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "https://hellohelp-update-backend.onrender.com/api/customer/customers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSend = async () => {
    if (!title || !message || userIds.length === 0) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem("token");

      for (const id of userIds) {
        const payload = {
          user_id: Number(id),
          title,
          body: message,
          data: { offer_code: "HELLO20" },
        };

        await axios.post(
          "https://hellohelp-update-backend.onrender.com/api/admin/push-notification",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSnackbar({
        open: true,
        severity: "success",
        message: "Notifications sent!",
      });
      setTitle("");
      setMessage("");
      setUserIds([]);
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
      <MDBox pt={6} pb={25}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12}>
            <MDBox width="100%">
              <Card>
                <MDBox
                  mx={2}
                  mt={-2}
                  mb={3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    🚀 Push Notification
                  </MDTypography>
                </MDBox>
                <MDBox px={3} pb={3}>
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel id="user-select-label" sx={{ top: -8 }}>
                        Select Users
                      </InputLabel>
                      <Select
                        labelId="user-select-label"
                        multiple
                        value={userIds}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.includes("all")) {
                            if (userIds.length === customers.length) {
                              setUserIds([]);
                            } else {
                              setUserIds(customers.map((c) => c.user_id));
                            }
                          } else {
                            setUserIds(value);
                          }
                        }}
                        renderValue={(selected) =>
                          customers
                            .filter((c) => selected.includes(c.user_id))
                            .map((c) => c.username)
                            .join(", ")
                        }
                        sx={{
                          borderRadius: 2,
                          backgroundColor: isDarkMode ? "#2e2e3e" : "#f9f9f9",
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <MenuItem value="all">
                          <Checkbox
                            checked={userIds.length === customers.length && customers.length > 0}
                            indeterminate={userIds.length > 0 && userIds.length < customers.length}
                          />
                          Select All
                        </MenuItem>

                        {customers.map((c) => (
                          <MenuItem key={c.user_id} value={c.user_id}>
                            <Checkbox checked={userIds.indexOf(c.user_id) > -1} />
                            {c.user_id} ({c.username})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

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

                    <TextField
                      label="Description (Optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
