import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import PropTypes from "prop-types";

const SendNotificationForm = ({ onSend }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all"); // all or single user
  const [userId, setUserId] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  const handleSend = () => {
    if (!title || !message) {
      setSnackbar({ open: true, severity: "error", message: "Title and message are required." });
      return;
    }
    if (target === "single" && !userId) {
      setSnackbar({ open: true, severity: "error", message: "Please enter a user ID." });
      return;
    }
    onSend({ title, message, target, userId });
    setSnackbar({ open: true, severity: "success", message: "Notification sent!" });
    setTitle("");
    setMessage("");
    setUserId("");
    setTarget("all");
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
      }}
    >
      <TextField
        label="Notification Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        label="Notification Message"
        variant="outlined"
        multiline
        minRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="target-select-label">Send To</InputLabel>
        <Select
          labelId="target-select-label"
          value={target}
          label="Send To"
          onChange={(e) => setTarget(e.target.value)}
        >
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="single">Single User</MenuItem>
        </Select>
      </FormControl>
      {target === "single" && (
        <TextField
          label="User ID"
          variant="outlined"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
        />
      )}

      <Button variant="contained" color="primary" onClick={handleSend}>
        Send Notification
      </Button>

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
    </Box>
  );
};

SendNotificationForm.propTypes = {
  onSend: PropTypes.func.isRequired,
};

export default SendNotificationForm;
