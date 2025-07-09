import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
// import CallDetails from "layouts/billing/components/CallDetails";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";

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

export default function CallHistory() {
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCallLogs([]);
      setLoading(false);
      return;
    }
    axios
      .get("http://54.226.150.175:3000/api/call/call-logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sortedLogs = res.data.sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
        setCallLogs(sortedLogs);
        setLoading(false);
      })
      .catch(() => {
        setCallLogs([]);
        setLoading(false);
      });
  }, []);

  // Helper to format date
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  function CallTypeChip({ value }) {
    return (
      <Chip
        label={value}
        sx={{
          backgroundColor: value === "audio" ? "#e3f0fc" : "#f3e8fd",
          color: value === "audio" ? "#1976d2" : "#9c27b0",
          fontWeight: 500,
          borderRadius: "8px",
          px: 1.5,
        }}
      />
    );
  }

  CallTypeChip.propTypes = {
    value: PropTypes.string.isRequired,
  };

  function StatusChip({ value }) {
    return (
      <Chip
        label={value}
        sx={{
          backgroundColor:
            value === "accepted" ? "#e3fde8" : value === "initiated" ? "#fdf7e3" : "#fde3e3",
          color: value === "accepted" ? "#388e3c" : value === "initiated" ? "#fbc02d" : "#d32f2f",
          fontWeight: 500,
          borderRadius: "8px",
          px: 1.5,
        }}
      />
    );
  }

  StatusChip.propTypes = {
    value: PropTypes.string.isRequired,
  };

  return (
    <>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                sx={{
                  background: "linear-gradient(90deg, #000E29 0%, #000E29 100%)", // gradient using your color
                  color: "white", // or any readable color
                  fontWeight: 600,
                  boxShadow: "0px 4px 20px rgba(0, 14, 41, 0.4)", // custom shadow to match color
                }}
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" fontWeight="bold" color="white">
                  📞 Call History
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Id", accessor: "id" },
                      { Header: "Date", accessor: "started_at" },
                      { Header: "caller Id", accessor: "caller_id" },
                      { Header: "Receiver Id", accessor: "receiver_id" },
                      {
                        Header: "Call Type",
                        accessor: "call_type",
                        // eslint-disable-next-line react/prop-types
                        Cell: ({ value }) => (
                          <Chip
                            label={value}
                            sx={{
                              backgroundColor: value === "audio" ? "#e3f0fc" : "#f3e8fd",
                              color: value === "audio" ? "#1976d2" : "#9c27b0",
                              fontWeight: 500,
                              borderRadius: "8px",
                              px: 1.5,
                            }}
                          />
                        ),
                      },
                      {
                        Header: "Request",
                        accessor: "status",
                        // eslint-disable-next-line react/prop-types
                        Cell: ({ value }) => (
                          <Chip
                            label={value}
                            sx={{
                              backgroundColor:
                                value === "accepted"
                                  ? "#e3fde8"
                                  : value === "initiated"
                                  ? "#fdf7e3"
                                  : "#fde3e3",
                              color:
                                value === "accepted"
                                  ? "#388e3c"
                                  : value === "initiated"
                                  ? "#fbc02d"
                                  : "#d32f2f",
                              fontWeight: 500,
                              borderRadius: "8px",
                              px: 1.5,
                            }}
                          />
                        ),
                      },
                      { Header: "Meeting Call ID", accessor: "meeting_call_id" },
                      { Header: "Device Type", accessor: (row) => row.metadata?.device || "-" },
                      {
                        Header: "Action",
                        accessor: (row) => (
                          <MDButton
                            component={Link}
                            to={`/CallDetails/${row.id}`}
                            variant="text"
                            sx={{
                              color: "#000E29",
                              fontWeight: 600,
                              "&:hover": {
                                color: "#001131",
                              },
                            }}
                            startIcon={<Icon>visibility</Icon>}
                          >
                            View
                          </MDButton>
                        ),
                      },
                    ],
                    rows: callLogs,
                  }}
                  isSorted={true}
                  entriesPerPage={{
                    defaultValue: 5,
                    entries: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
                  }}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* <MDTypography variant="body2" color="text">
        {loading ? "Loading..." : `Showing ${callLogs.length} calls`}
      </MDTypography> */}
    </>
  );
}
