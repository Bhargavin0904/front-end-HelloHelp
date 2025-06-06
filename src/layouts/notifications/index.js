import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  Grid,
  InputLabel,
  FormControl,
  Card,
  Typography,
  Stack,
  Icon,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";

function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const handleSend = async () => {
    if (!title || !message || !target || (target === "single" && !userId)) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Please fill in all required fields before sending.",
      });
      return;
    }

    try {
      setSending(true);
      const response = await axios("https://your-backend.com/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          target,
          userId: target === "single" ? userId : undefined,
          ...(date &&
            time && {
              date: date.format("YYYY-MM-DD"),
              time: time.format("HH:mm"),
            }),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, severity: "success", message: "Notification sent!" });
        setTitle("");
        setMessage("");
        setUserId("");
        setTarget("all");
        setDate(null);
        setTime(null);
      } else {
        throw new Error(data.message || "Failed to send notification.");
      }
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={5} mb={6}>
        <Grid container justifyContent="center">
          <Grid item xs={10} md={5} lg={15}>
            <Card sx={{ p: 5, borderRadius: 3, boxShadow: 5 }}>
              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                mt={-7}
                py={3}
                px={3}
                mb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h5" color="white">
                  🚀 Push Notifications
                </MDTypography>
                <MDTypography variant="caption" color="white">
                  Schedule & Send messages to users
                </MDTypography>
              </MDBox>

              <Stack spacing={3}>
                <Typography variant="h6">1. Notification</Typography>
                <TextField
                  label="Notification Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  InputProps={{
                    // startAdornment: <Icon sx={{ mr: 1 }}>title</Icon>,
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
                    // startAdornment: <Icon sx={{ mr: 1 }}>message</Icon>,
                    sx: {
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#2e2e3e" : "#f9f9f9",
                    },
                  }}
                />

                <Divider />
                <Typography variant="h6">2. Target</Typography>
                <FormControl fullWidth>
                  {/* <InputLabel>Send To</InputLabel> */}
                  <Select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#2e2e3e" : "#fff",
                    }}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="single">Single User</MenuItem>
                  </Select>
                </FormControl>

                {target === "single" && (
                  <TextField
                    label="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    fullWidth
                    InputProps={{ startAdornment: <Icon sx={{ mr: 1 }}>person</Icon> }}
                  />
                )}

                <Divider />
                <Typography variant="h6">3. Schedule</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Select Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TimePicker
                        label="Select Time"
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>

                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={sending || !title || !message || (target === "single" && !userId)}
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

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Box,
//   Snackbar,
//   Alert,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Card,
//   Typography,
// } from "@mui/material";
// import PropTypes from "prop-types";

// const SendNotificationForm = ({ onSend }) => {
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");
//   const [target, setTarget] = useState("all"); // all or single user
//   const [userId, setUserId] = useState("");
//   const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

//   const handleSend = () => {
//     if (!title || !message) {
//       setSnackbar({ open: true, severity: "error", message: "Title and message are required." });
//       return;
//     }
//     if (target === "single" && !userId) {
//       setSnackbar({ open: true, severity: "error", message: "Please enter a user ID." });
//       return;
//     }
//     onSend({ title, message, target, userId });
//     setSnackbar({ open: true, severity: "success", message: "Notification sent!" });
//     setTitle("");
//     setMessage("");
//     setUserId("");
//     setTarget("all");
//   };

//   return (
//     <Card sx={{ p: 5, maxWidth: 1000, margin: "auto", top: 20 }}>
//       <Typography variant="h5" alignContent={"center"} gutterBottom>
//         Notification
//       </Typography>
//       <p>Use this form to send push notifications to users.</p>
//       <Box
//         sx={{
//           maxWidth: 1000,
//           margin: "auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: 2,
//           p: 3,
//         }}
//       >
//         <TextField
//           label="Notification Title"
//           variant="outlined"
//           value={title}
//           maxWidth={500}
//           onChange={(e) => setTitle(e.target.value)}
//           fullWidth
//         />
//         <TextField
//           label="Notification Text"
//           variant="outlined"
//           multiline
//           minRows={3}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           fullWidth
//         />
//         <FormControl fullWidth>
//           <InputLabel id="target-select-label">Send To</InputLabel>
//           <Select
//             labelId="target-select-label"
//             value={target}
//             label="Send To"
//             onChange={(e) => setTarget(e.target.value)}
//           >
//             <MenuItem value="all">All Users</MenuItem>
//             <MenuItem value="single">Single User</MenuItem>
//           </Select>
//         </FormControl>
//         {target === "single" && (
//           <TextField
//             label="User ID"
//             variant="outlined"
//             value={userId}
//             onChange={(e) => setUserId(e.target.value)}
//             fullWidth
//           />
//         )}

//         <Button variant="contained" color="primary" onClick={handleSend}>
//           Send Notification
//         </Button>

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={4000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//         >
//           <Alert
//             severity={snackbar.severity}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             sx={{ width: "100%" }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </Card>
//   );
// };

// SendNotificationForm.propTypes = {
//   onSend: PropTypes.func.isRequired,
// };

// export default SendNotificationForm;
