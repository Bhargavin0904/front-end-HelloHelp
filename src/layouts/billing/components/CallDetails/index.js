import { useParams, useNavigate } from "react-router-dom";
import { Card, Typography, Box, Chip, Divider, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Sample mock data
// const mockData = [
//   {
//     id: 1,
//     date: "May 1, 2024",
//     agent: "Alice Smith",
//     customer: "John Doe",
//     type: "Internal",
//     request: "Support",
//     tollFree: "1800-123-456",
//     customerNo: "+91-9876543210",
//     sentiment: "Positive",
//     duration: "12:35",
//     callType: "video",
//     notes:
//       "Customer inquired about upgrading their current plan. Provided detailed information about premium plans and special offers.",
//     transcript: `Agent: Thank you for calling customer support. This is Alice. How may I help you today?\nCustomer: Hi Alice, I'm looking to upgrade my current plan.\nAgent: I'd be happy to help you with that. Let me explain our premium options...`,
//     resolution:
//       "Customer expressed interest in the Premium Plus plan. Scheduled a follow-up call for next week.",
//   },
//   {
//     id: 2,
//     date: "May 2, 2024",
//     agent: "Bob Johnson",
//     customer: "Jane Roe",
//     type: "External",
//     request: "Complaint",
//     tollFree: "1800-234-567",
//     customerNo: "+91-8765432109",
//     sentiment: "Negative",
//     duration: "08:20",
//     callType: "Audio",
//     notes:
//       "Customer reported an issue with billing. Apologized and escalated the issue to the billing department.",
//     transcript: `Agent: Hello, this is Bob from support. How can I assist?\nCustomer: I have a billing issue on my last invoice.\nAgent: I'm sorry to hear that. Let me check your account...`,
//     resolution: "Issue escalated to billing. Promised a callback within 24 hours.",
//   },
//   {
//     id: 3,
//     date: "May 3, 2024",
//     agent: "Charlie Lee",
//     customer: "Sam Wilson",
//     type: "Internal",
//     request: "Inquiry",
//     tollFree: "1800-345-678",
//     customerNo: "+91-7654321098",
//     sentiment: "Neutral",
//     duration: "05:45",
//     callType: "Audio",
//     notes:
//       "Customer asked about service availability in their area. Provided information and suggested alternatives.",
//     transcript: `Agent: Good afternoon, this is Charlie. How may I help?\nCustomer: Is your service available in my area?\nAgent: Let me check your location...`,
//     resolution: "Customer informed about service coverage and alternatives.",
//   },
//   {
//     id: 4,
//     date: "May 4, 2024",
//     agent: "Diana Prince",
//     customer: "Bruce Wayne",
//     type: "External",
//     request: "Support",
//     tollFree: "1800-456-789",
//     customerNo: "+91-6543210987",
//     sentiment: "Positive",
//     duration: "10:10",
//     callType: "video",
//     notes:
//       "Customer needed help resetting their password. Guided through the process successfully.",
//     transcript: `Agent: Hello, Diana here. How can I help?\nCustomer: I forgot my password.\nAgent: No problem, let's reset it together...`,
//     resolution: "Password reset successfully. Customer satisfied.",
//   },
//   {
//     id: 5,
//     date: "May 5, 2024",
//     agent: "Ethan Hunt",
//     customer: "Clark Kent",
//     type: "Internal",
//     request: "Feedback",
//     tollFree: "1800-567-890",
//     customerNo: "+91-5432109876",
//     sentiment: "Positive",
//     duration: "03:30",
//     callType: "Audio",
//     notes: "Customer provided positive feedback about the new app interface.",
//     transcript: `Agent: Hi, this is Ethan. How can I assist?\nCustomer: Just wanted to say I love the new app design!\nAgent: Thank you for your feedback!`,
//     resolution: "Feedback noted and shared with the product team.",
//   },
// ];

const typeColor = {
  Internal: "info",
  External: "secondary",
};

const requestColor = {
  Support: "primary",
  Complaint: "warning",
  Inquiry: "info",
  Feedback: "success",
};

const sentimentColor = {
  Positive: "success",
  Negative: "error",
  Neutral: "warning",
};

export default function CallDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`https://hellohelp-update-backend.onrender.com/api/call/call-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Find the call log by id
        const found = res.data.find((item) => String(item.id) === String(id));
        setRow(found || null);
        setLoading(false);
      })
      .catch(() => {
        setRow(null);
        setLoading(false);
      });
  }, [id]);

  const chipStyles = {
    type: {
      audio: { backgroundColor: "#e3f0fc", color: "#1976d2" },
      video: { backgroundColor: "#f3e8fd", color: "#9c27b0" },
    },
    status: {
      accepted: { backgroundColor: "#e3fde8", color: "#388e3c" },
      initiated: { backgroundColor: "#fdf7e3", color: "#fbc02d" },
      ended: { backgroundColor: "#fde3e3", color: "#d32f2f" },
    },
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!row) return <Typography>Call not found</Typography>;

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 900 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
          <Typography variant="button" sx={{ ml: 1 }}>
            Back to Call History
          </Typography>
        </IconButton>

        <Card
          sx={{
            mt: 2,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: 2,
            maxWidth: 1500,
            width: "100%",
            background: "#fff",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Call Details: {row.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(row.started_at)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={row.call_type}
                size="small"
                sx={{
                  ...chipStyles.type[row.call_type],
                  fontWeight: 500,
                  borderRadius: "8px",
                  px: 1.5,
                  fontSize: 14,
                  textTransform: "capitalize",
                }}
              />
              <Chip
                label={row.status}
                size="small"
                sx={{
                  ...chipStyles.status[row.status],
                  fontWeight: 500,
                  borderRadius: "8px",
                  px: 1.5,
                  fontSize: 14,
                  textTransform: "capitalize",
                }}
              />
            </Stack>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" py={2}>
            <Box flex="1" minWidth={200} pr={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Caller ID
              </Typography>
              <Typography>{row.caller_id}</Typography>
              <Typography variant="subtitle2" color="text.secondary" mt={1}>
                Meeting Call ID
              </Typography>
              <Typography>{row.meeting_call_id ?? "-"}</Typography>
              <Typography variant="subtitle2" color="text.secondary" mt={1}>
                Duration
              </Typography>
              <Typography>{row.duration ?? "-"}</Typography>
            </Box>

            <Box flex="1" minWidth={200}>
              <Typography variant="subtitle2" color="text.secondary">
                Receiver ID
              </Typography>
              <Typography>{row.receiver_id ?? "-"}</Typography>
              <Typography variant="subtitle2" color="text.secondary" mt={1}>
                Device
              </Typography>
              <Typography>{row.metadata?.device ?? "-"}</Typography>
              <Typography variant="subtitle2" color="text.secondary" mt={1}>
                Status
              </Typography>
              <Typography>{row.status}</Typography>
            </Box>
          </Box>
          <Divider />
          <Box mt={2}>
            <Typography variant="subtitle2" mb={0.5}>
              Notes
            </Typography>
            <Typography variant="body2" color="text.primary">
              {row.metadata?.notes ?? "-"}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
