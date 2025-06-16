import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { BarChart2, LineChart as LineChartIcon } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("day");
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ initiated: 0, ended: 0, total: 0 });

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
          "https://lemonpeak-hellohelp-backend.onrender.com/api/call/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              timeRange,
            },
          }
        );

        const { initiated_calls = 0, ended_calls = 0 } = res.data;

        const formattedData = [
          {
            time: timeRange.toUpperCase(),
            initiated: parseInt(initiated_calls, 10),
            ended: parseInt(ended_calls, 10),
          },
        ];

        setChartData(formattedData);
        setTotals({
          initiated: formattedData[0].initiated,
          ended: formattedData[0].ended,
          total: formattedData[0].initiated + formattedData[0].ended,
        });
      } catch (err) {
        console.error("Error fetching call stats:", err);
        setChartData([]);
        setTotals({ initiated: 0, ended: 0, total: 0 });
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
          📊 Call Analytics
        </MDTypography>
      </MDBox>

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
                Initiated calls
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totals.initiated}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Ended calls
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {totals.ended}
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
                <YAxis
                  label={{ value: "Calls", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                  domain={[0, "dataMax + 8"]}
                  allowDecimals={false}
                />
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
                  dataKey="initiated"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="ended"
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
                <YAxis
                  label={{ value: "Calls", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 12 }}
                  stroke={theme.palette.text.secondary}
                  domain={[0, "dataMax + 10"]}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderColor: theme.palette.divider,
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Legend />
                <Bar dataKey="initiated" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                <Bar dataKey="ended" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CallsChartCard;
