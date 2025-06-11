import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // For formatting date

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import Header from "layouts/profile/components/Header";

function StatusChip({ value }) {
  return (
    <Chip
      label={value}
      sx={{
        backgroundColor: value === "Sent" ? "#e3fde8" : "#fde3e3",
        color: value === "Sent" ? "#388e3c" : "#d32f2f",
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

function RecipientsCell({ value }) {
  return (
    <Tooltip title={value.join(", ")}>
      <span>{value.length} user(s)</span>
    </Tooltip>
  );
}

RecipientsCell.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function MessageCell({ value }) {
  return (
    <Tooltip title={value}>
      <span>{value.length > 30 ? value.slice(0, 30) + "..." : value}</span>
    </Tooltip>
  );
}

MessageCell.propTypes = {
  value: PropTypes.string.isRequired,
};

function NotificationHistory() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔐 Get token from localStorage
        const response = await axios.get(
          "https://hellohelp-update-backend.onrender.com/api/admin/notification-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transformed = response.data.map((n) => ({
          id: n.id,
          campaignId: n.campaign_id || "-",
          date: dayjs(n.sent_at).format("YYYY-MM-DD hh:mm A"),
          userid: n.user_id,
          username: n.username,
          recipients: [n.username],
          title: n.title,
          message: n.body,
          offerCode: n.data?.offer_code || "-",
          status: n.status === "success" ? "Sent" : "Failed",
        }));

        setNotifications(transformed);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={5}>
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
                  <MDTypography variant="h6" fontWeight="bold" color="white">
                    📬 Notification History
                  </MDTypography>
                </MDBox>
                <MDBox pt={1}>
                  <DataTable
                    table={{
                      columns: [
                        { Header: "Id", accessor: "id" },
                        { Header: "Date & Time", accessor: "date" },
                        { Header: "Campaign Id", accessor: "campaignId" },
                        { Header: "User Id", accessor: "userid" },
                        { Header: "User Name", accessor: "username" },
                        { Header: "Recipients", accessor: "recipients", Cell: RecipientsCell },
                        { Header: "Title", accessor: "title" },
                        { Header: "Message", accessor: "message", Cell: MessageCell },
                        { Header: "Offer Code", accessor: "offerCode" },
                        { Header: "Status", accessor: "status", Cell: StatusChip },
                      ],
                      rows: notifications,
                    }}
                    isSorted={true}
                    entriesPerPage={{
                      defaultValue: 5,
                      entries: [5, 10, 20, 50],
                    }}
                    showTotalEntries={true}
                    noEndBorder
                  />
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

export default NotificationHistory;
