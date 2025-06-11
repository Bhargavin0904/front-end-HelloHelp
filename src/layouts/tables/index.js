import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import projectsTableData from "layouts/tables/data/CustomerList";
import useAgentTableData from "layouts/tables/data/AgentList";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import MDButton from "components/MDButton";
import AddAgent from "layouts/tables/data/AddAgent";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Users() {
  const { columns, rows } = useAgentTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    is_agent: true,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchAgents = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://hellohelp-update-backend.onrender.com/api/auth/register",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Format your rows as needed for DataTable
      setRows(response.data); // or your formatted rows
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={5}>
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" fontWeight="bold" color="white">
                  👨‍💼 All Agents
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  sx={{ color: "#1976d2", fontWeight: 600 }}
                >
                  Add Agent
                </MDButton>
                <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                  <DialogTitle sx={{ textAlign: "center" }}>Add New Agent</DialogTitle>
                  <AddAgent
                    form={form}
                    onChange={handleChange}
                    onAgentAdded={() => {
                      fetchAgents();
                      setSnackbarOpen(true);
                    }}
                    onClose={handleClose}
                  />
                </Dialog>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
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
                  👥 All Customers
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Agent Added Successfully
        </Alert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
