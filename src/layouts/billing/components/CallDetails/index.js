import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Grid,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!row) return <Typography>Call not found</Typography>;

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2, borderRadius: 3, background: "#f5f7fa" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 900 }}>
          <Box>
            {/* Top Buttons */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ fontWeight: 600, color: "white" }}
              >
                Back to Call History
                {/* </Typography> */}
              </Button>
            </Stack>

            {/* Title */}

            {/* <Card
            sx={{
              mt: 2,
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              boxShadow: 2,
              maxWidth: 1500,
              width: "100%",
              background: "#fff",
            }}
          > */}
            <Box
              sx={{
                width: "100%",
                height: 100,
                background: "#1976d2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                borderRadius: 2,
              }}
            >
              {" "}
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  fontFamily: '"Roboto", "Arial", sans-serif',
                  mt: 2,
                  mb: 1,
                  color: "#fff",
                  letterSpacing: 1,
                }}
              >
                Call History Details
              </Typography>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Call Id: {row.id}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  Created at: {formatDate(row.created_at)}
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
            <Box sx={{ my: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      boxShadow: 1,
                      height: "100%",
                      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Caller ID: </strong>
                      {row.caller_id}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Caller Name: </strong>
                      {row.caller_name}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Meeting Call ID:</strong> {row.meeting_call_id ?? "-"}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Started at:</strong> {row.started_at ?? "-"}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Ended at:</strong> {row.ended_at ?? "-"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "#f8fafc",
                      boxShadow: 1,
                      height: "100%",
                      // fontFamily: "'Segoe UI', 'Roboto', sans-serif",
                    }}
                  >
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Receiver ID:</strong> {row.receiver_id ?? "-"}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Receiver Name:</strong> {row.receiver_name ?? "-"}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Device:</strong> {row.metadata?.device ?? "-"}
                    </Typography>
                    {/* <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Status:</strong> {row.status}
                    </Typography> */}
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Duration:</strong> {row.duration ?? "-"}
                    </Typography>
                    <Typography sx={{ variant: "h6", fontWeight: 400, mb: 1, fontSize: "1.1rem" }}>
                      <strong>Recent Calls:</strong> {row.callDirection ?? "-"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            {/* <Divider /> */}
            <Card sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Box mt={2}>
                <Typography variant="subtitle2" mb={0.5}>
                  <strong>Notes: </strong> {row.metadata?.notes ?? "-"}
                </Typography>
                <Typography variant="subtitle2" mb={0.5}>
                  <strong>Agent Id: </strong> {row.metadata?.agent_id ?? "-"}
                </Typography>
                <Typography variant="subtitle2" mb={0.5}>
                  <strong>Initiated By: </strong> {row.metadata?.initiated_by ?? "-"}
                </Typography>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
