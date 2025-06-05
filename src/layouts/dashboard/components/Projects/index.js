// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import React from "react";
// import Performance from "layouts/dashboard/components/Projects/PerformanceMatrix";
import CallsChartCard from "layouts/dashboard/components/Projects/chart";
import RecentCalls from "layouts/dashboard/components/Projects/data";

function Projects() {
  return (
    <>
      <MDBox display="flex" flexDirection="column" height="100%">
        {/* <MDBox mt={1} mx={2}>
          <Performance />
        </MDBox> */}
        <MDBox mt={1} mx={2}>
          <CallsChartCard />
        </MDBox>
        <MDBox mt={3} mx={2}>
          <RecentCalls />
        </MDBox>
      </MDBox>
    </>
  );
}

export default Projects;
