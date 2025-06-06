// components/AdminNotificationPage.js
import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import SendNotificationForm from "./SendNotification";

const AdminNotificationPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        🔔 Push Notification Panel
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <SendNotificationForm />
      </Paper>
    </Container>
  );
};

export default AdminNotificationPage;
