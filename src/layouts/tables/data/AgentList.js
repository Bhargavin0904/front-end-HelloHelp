import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import PersonIcon from "@mui/icons-material/Person";

// Placeholder image
import team2 from "assets/images/team-2.jpg";
import { Icon } from "@mui/material";
import MDButton from "components/MDButton";

const Author = ({ image, name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar size="sm" sx={{ bgcolor: "#000E29" }}>
      <PersonIcon sx={{ color: "#fff" }} />
    </MDAvatar>
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  </MDBox>
);
Author.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

const Job = ({ title }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {title}
    </MDTypography>
  </MDBox>
);
Job.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function useAgentTableData() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }
    axios
      .get("http://54.226.150.175:3000/api/agent/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        const agentData = response.data;
        const formattedRows = agentData.map((agent) => ({
          id: <Job title={String(agent.id)} />,
          username: (
            <Author
              image={team2}
              name={agent.username?.charAt(0).toUpperCase() + agent.username?.slice(1)}
            />
          ),
          email: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {agent.email}
            </MDTypography>
          ),
          phone: (
            <MDBox ml={-1} display="flex" alignItems="center">
              {/* <MDBadge color={agent.phone ? "success" : "dark"} variant="gradient" size="sm" /> */}
              <MDTypography variant="caption" color="text" fontWeight="medium" ml={1}>
                {agent.phone}
              </MDTypography>
            </MDBox>
          ),
          // created_at: (
          //   <MDTypography variant="caption" color="text" fontWeight="medium">
          //     {agent.created_at}
          //   </MDTypography>
          // ),
          // updated_at: (
          //   <MDTypography variant="caption" color="text" fontWeight="medium">
          //     {agent.updated_at}
          //   </MDTypography>
          // ),
          action: (
            <MDButton
              component={Link}
              to={`/agent/${agent.id}`}
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
        // console.log("Formatted Rows:", formattedRows);
        setRows(formattedRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching agent data:", error);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    columns: [
      { Header: "Id", accessor: "id", width: "10%", align: "left" },
      { Header: "Firstname", accessor: "username", width: "20%", align: "left" },
      { Header: "Lastname", accessor: "", width: "20%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Phone no", accessor: "phone", align: "center" },
      // { Header: "created at", accessor: "created_at", align: "center" },
      // { Header: "updated at", accessor: "updated_at", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows,
    loading,
  };
}
