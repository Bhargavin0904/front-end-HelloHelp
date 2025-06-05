import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

const metrics = [
  {
    label: "First Response",
    value: "45s",
    progress: 90,
    trend: "+12%",
    trendIcon: <ArrowDropUp fontSize="small" sx={{ color: "green" }} />,
    trendColor: "green",
    target: "< 60s",
    ringColor: "#2e7d32",
  },
  {
    label: "Resolution Time",
    value: "4.2m",
    progress: 85,
    trend: "+8%",
    trendIcon: <ArrowDropUp fontSize="small" sx={{ color: "green" }} />,
    trendColor: "green",
    target: "< 5m",
    ringColor: "#2e7d32",
  },
  {
    label: "Customer Sat.",
    value: "94%",
    progress: 94,
    trend: "+2%",
    trendIcon: <ArrowDropUp fontSize="small" sx={{ color: "green" }} />,
    trendColor: "green",
    target: "≥ 90%",
    ringColor: "#2e7d32",
  },
  {
    label: "Call Drop Rate",
    value: "3.5%",
    progress: 65,
    trend: "-0.5%",
    trendIcon: <ArrowDropDown fontSize="small" sx={{ color: "red" }} />,
    trendColor: "red",
    target: "< 3%",
    ringColor: "#fb8c00",
  },
];

const Performance = () => {
  return (
    <Card elevation={1} sx={{ borderRadius: 3, px: 2, py: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Performance Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Key performance indicators
        </Typography>

        <Grid container spacing={4}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box position="relative" display="inline-flex">
                  <CircularProgress
                    variant="determinate"
                    value={metric.progress}
                    size={72}
                    thickness={4.5}
                    sx={{ color: metric.ringColor }}
                  />
                  <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="subtitle1" fontWeight="600">
                      {metric.value}
                    </Typography>
                  </Box>
                </Box>

                <Typography mt={1} fontSize="0.95rem" fontWeight={500}>
                  {metric.label}
                </Typography>

                <Box display="flex" alignItems="center" mt={0.5}>
                  {metric.trendIcon}
                  <Typography variant="caption" fontWeight={500} color={metric.trendColor}>
                    {metric.trend}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Target: {metric.target}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Performance;
