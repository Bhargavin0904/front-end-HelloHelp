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
//   },
//   {
//     date: "May 6, 2024",
//     agent: "Fiona Glenanne",
//     customer: "Peter Parker",
//     type: "External",
//     request: "Complaint",
//     tollFree: "1800-678-901",
//     customerNo: "+91-4321098765",
//     sentiment: "Negative",
//   },
// ];

// Badge color mapping
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
      .get("https://hellohelp-update-backend.onrender.com/api/call/call-logs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCallLogs(res.data);
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
      {/* <Card> */}
      {/* <MDBox p={3}> */}
      {/* <Stack direction="row" justifyContent="space-between" alignItems="center"> */}
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
                bgColor="info"
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
                      { Header: "Agent", accessor: "caller_id" },
                      { Header: "Customer", accessor: "receiver_id" },
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
                            color="info"
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
      <MDTypography variant="body2" color="text.secondary">
        {loading ? "Loading..." : `Showing ${callLogs.length} calls`}
      </MDTypography>
      {/* </Stack> */}

      {/* <MDBox
        component="table"
        width="100%"
        mt={3}
        sx={{
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          fontSize: "0.875rem",
        }}
      >
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Id</th>
            <th>Date</th>
            <th>Agent</th>
            <th>Customer</th>
            <th>Call Type</th>
            <th>Request</th>
            <th>Toll Free</th>
            <th>Device type</th>
            {/* <th>Sentiment</th> */}
      {/* <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            callLogs.map((row) => (
              <tr
                key={row.id}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <td>{row.id}</td>
                <td style={{ padding: "10px 16px" }}>{formatDate(row.started_at)}</td>
                <td>{row.caller_id}</td>
                <td>{row.receiver_id ?? "-"}</td>
                <td>
                  <Chip
                    label={row.call_type}
                    sx={{
                      backgroundColor: row.call_type === "audio" ? "#e3f0fc" : "#f3e8fd",
                      color: row.call_type === "audio" ? "#1976d2" : "#9c27b0",
                      fontWeight: 500,
                      borderRadius: "8px",
                      px: 1.5,
                    }}
                  />
                </td>
                <td>
                  <Chip
                    label={row.status}
                    sx={{
                      backgroundColor:
                        row.status === "accepted"
                          ? "#e3fde8"
                          : row.status === "initiated"
                          ? "#fdf7e3"
                          : "#fde3e3",
                      color:
                        row.status === "accepted"
                          ? "#388e3c"
                          : row.status === "initiated"
                          ? "#fbc02d"
                          : "#d32f2f",
                      fontWeight: 500,
                      borderRadius: "8px",
                      px: 1.5,
                    }}
                  />
                </td>
                <td>{row.meeting_call_id ?? "-"}</td>
                <td>{row.metadata?.device ?? "-"}</td>
                <td>
                  <MDButton
                    component={Link}
                    to={`/CallDetails/${row.id}`}
                    variant="text"
                    color="info"
                    startIcon={<Icon>visibility</Icon>}
                  >
                    View
                  </MDButton>
                </td>
              </tr>
            ))}
        </tbody> */}
      {/* // </MDBox> */}
      {/* </MDBox> */}
      {/* // </Card> */}
    </>
  );
}
