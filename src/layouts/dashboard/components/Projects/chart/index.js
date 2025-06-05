import React, { useState } from "react";
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

  const handleChartTypeChange = (_event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleTimeRangeChange = (_event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Sample data for different time ranges
  const dayData = [
    { time: "9 AM", received: 12, dialed: 8 },
    { time: "10 AM", received: 19, dialed: 11 },
    { time: "11 AM", received: 15, dialed: 14 },
    { time: "12 PM", received: 8, dialed: 10 },
    { time: "1 PM", received: 10, dialed: 7 },
    { time: "2 PM", received: 14, dialed: 12 },
    { time: "3 PM", received: 18, dialed: 15 },
    { time: "4 PM", received: 21, dialed: 13 },
    { time: "5 PM", received: 16, dialed: 9 },
  ];

  const weekData = [
    { time: "Mon", received: 85, dialed: 65 },
    { time: "Tue", received: 92, dialed: 78 },
    { time: "Wed", received: 104, dialed: 82 },
    { time: "Thu", received: 98, dialed: 76 },
    { time: "Fri", received: 110, dialed: 90 },
    { time: "Sat", received: 45, dialed: 30 },
    { time: "Sun", received: 30, dialed: 25 },
  ];

  const monthData = [
    { time: "Week 1", received: 564, dialed: 482 },
    { time: "Week 2", received: 612, dialed: 530 },
    { time: "Week 3", received: 587, dialed: 498 },
    { time: "Week 4", received: 635, dialed: 545 },
  ];

  // Select the appropriate data based on timeRange
  const chartData = timeRange === "day" ? dayData : timeRange === "week" ? weekData : monthData;

  // Calculate total calls for the selected time range
  const totalReceived = chartData.reduce((sum, item) => sum + item.received, 0);
  const totalDialed = chartData.reduce((sum, item) => sum + item.dialed, 0);
  const totalCalls = totalReceived + totalDialed;

  return (
    <Card sx={{ height: "100%", width: "155%", borderRadius: 3 }}>
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
        // title="Call Analytics"
        subheader={`${totalCalls} total calls in selected period`}
        action={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" sx={{ mr: 1 }} aria-label="Download report">
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
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: { xs: 1, sm: 0 } }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Received
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totalReceived}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Dialed
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totalDialed}
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
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke={theme.palette.text.warning} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.warning.paper,
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
                  stroke={theme.palette.text.secondary}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke={theme.palette.text.secondary} tick={{ fontSize: 12 }} />
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
