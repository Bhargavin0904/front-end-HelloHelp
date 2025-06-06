import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { MoreVertical, BarChart2, LineChart as LineChartIcon, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const CallsChartCard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ received: 0, dialed: 0, total: 0 });

  const handleChartTypeChange = (_event, newChartType) => {
    if (newChartType !== null) setChartType(newChartType);
  };

  const handleTimeRangeChange = (_event, newTimeRange) => {
    if (newTimeRange !== null) setTimeRange(newTimeRange);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://hellohelp-update-backend.onrender.com/api/call/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              timeRange,
            },
          }
        );

        const apiData = res.data?.data || [];
        const received = apiData.reduce((sum, item) => sum + (item.received || 0), 0);
        const dialed = apiData.reduce((sum, item) => sum + (item.dialed || 0), 0);
        setChartData(apiData);
        setTotals({ received, dialed, total: received + dialed });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setChartData([]);
        setTotals({ received: 0, dialed: 0, total: 0 });
      }
    };
    fetchData();
  }, [timeRange]);

  return (
    <Card sx={{ height: "100%", width: isMobile ? "100%" : "155%", borderRadius: 3 }}>
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
          📊 Call Analytics
        </MDTypography>
      </MDBox>

      <CardHeader
        subheader={`${totals.total} total calls in selected period`}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small" aria-label="Download report">
              <Download size={18} />
            </IconButton>
            <IconButton size="small" aria-label="More options">
              <MoreVertical size={18} />
            </IconButton>
          </Box>
        }
      />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Received
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totals.received}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Dialed
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totals.dialed}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <ToggleButtonGroup
              size="small"
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              aria-label="chart type"
            >
              <ToggleButton value="line" aria-label="line chart">
                <LineChartIcon size={16} />
              </ToggleButton>
              <ToggleButton value="bar" aria-label="bar chart">
                <BarChart2 size={16} />
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              size="small"
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
            >
              <ToggleButton value="day" aria-label="day">
                Day
              </ToggleButton>
              <ToggleButton value="week" aria-label="week">
                Week
              </ToggleButton>
              <ToggleButton value="month" aria-label="month">
                Month
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Box sx={{ height: isMobile ? 300 : 350, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="received"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="dialed"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                />
                <YAxis tick={{ fontSize: 12 }} stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Bar dataKey="received" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                <Bar dataKey="dialed" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CallsChartCard;
