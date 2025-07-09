/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Icon from "@mui/material/Icon";
import axios from "axios";
import React from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDBadge from "components/MDBadge";
import PersonIcon from "@mui/icons-material/Person";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import { Link } from "react-router-dom";
import MDButton from "components/MDButton";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar size="sm" sx={{ bgcolor: "#000E29" }}>
        <PersonIcon sx={{ color: "#fff" }} />
      </MDAvatar>{" "}
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title || "-"}
      </MDTypography>
    </MDBox>
  );

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setRows([]);
      return;
    }
    axios
      .get("http://54.226.150.175:3000/api/customer/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        const customerData = response.data;
        const formattedRows = customerData.map((customer) => ({
          id: <Job title={String(customer.id)} />,
          username: (
            <Author
              image={team2}
              name={customer.username?.charAt(0).toUpperCase() + customer.username?.slice(1)}
            />
          ),
          email: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {customer.email}
            </MDTypography>
          ),
          phone_no: (
            <MDBox ml={-1}>
              {/* <MDBadge
                // badgeContent={customer.phone ? "online" : "offline"}
                // color={customer.phone ? "success" : "dark"}
                // variant="gradient"
                size="sm"
              /> */}
              <MDTypography variant="caption" color="text" fontWeight="medium" ml={1}>
                {customer.phone}
              </MDTypography>
            </MDBox>
          ),
          // created_at: (
          //   <MDTypography variant="caption" color="text" fontWeight="medium">
          //     {customer.created_at}
          //   </MDTypography>
          // ),
          // updated_at: (
          //   <MDTypography variant="caption" color="text" fontWeight="medium">
          //     {customer.updated_at}
          //   </MDTypography>
          // ),
          action: (
            <MDButton
              component={Link}
              to={`/customer/${customer.id}`}
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
        }));
        setRows(formattedRows);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, []);

  return {
    columns: [
      { Header: "Id", accessor: "id", width: "8%", align: "left" },
      { Header: "Firstname", accessor: "username", align: "left" },
      { Header: "Lastname", accessor: "", align: "left" },
      { Header: "email", accessor: "email", align: "left" },
      { Header: "phone no", accessor: "phone_no", align: "center" },
      // { Header: "created at", accessor: "created_at", align: "center" },
      // { Header: "updated at", accessor: "updated_at", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows,
  };
}
