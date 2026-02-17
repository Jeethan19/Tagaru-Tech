import React, { useMemo, useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";
import Navbar from "../sections/navbar";
import Sidebar from "../sections/sidebar";
import { Paper, Box, Typography, Divider, Button } from "@mui/material";
import animalDetails from "../data/animal_details.json";
import healthCondition from "../data/health_condition1.json";
import { useParams } from "react-router";
import useLiveData from "../components/useLiveData";

const LiveStockInfo = () => {
  const { liveStockId } = useParams();
  const liveData = useLiveData();

  const [chartKey, setChartKey] = useState(0);
  const [liveHistory, setLiveHistory] = useState({
    temperature: [],
    BPM: [],
    steps: [],
  });

  // 🧠 When live data arrives, push to history
  useEffect(() => {
    if (liveData?.temperature && liveData?.BPM && liveData?.motion !== undefined) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newStep = Math.round(liveData.motion * 10000);

      setLiveHistory((prev) => ({
        temperature: [...prev.temperature, { x: now, y: liveData.temperature }].slice(-10),
        BPM: [...prev.BPM, { x: now, y: liveData.BPM }].slice(-10),
        steps: [...prev.steps, { x: now, y: newStep }].slice(-10),
      }));

      setChartKey((k) => k + 1);
    }
  }, [liveData]);

  if (!liveStockId || isNaN(parseInt(liveStockId))) {
    return <div>Invalid liveStockId</div>;
  }

  const isLive = parseInt(liveStockId) === 4 && !!liveData;

  // 🧩 Historical health data
  const liveStockDetails = useMemo(
    () => healthCondition.filter((a) => a.animal_id == liveStockId),
    [liveStockId]
  );

  // 🦶 Step Count Bar Chart
  const barChartStepCount = useMemo(() => {
    const staticData = liveStockDetails.map(({ step_count, last_checkup_date }) => ({
      value: step_count,
      Label: last_checkup_date,
    }));

    // Add historical + live data as bars
    const liveBars = liveHistory.steps.map((s) => ({
      value: s.y,
      Label: s.x,
    }));

    return [...staticData, ...liveBars];
  }, [liveStockDetails, liveHistory]);

  // ❤️ Heart Rate Chart
  const lineChartHeartRate = [
    {
      id: "Heart Rate",
      data: [
        ...liveStockDetails.map(({ heart_rate, last_checkup_date }) => ({
          x: last_checkup_date,
          y: heart_rate,
        })),
        ...liveHistory.BPM,
      ],
    },
  ];

  // 🌡 Temperature Chart
  const lineChartTemperature = [
    {
      id: "Temperature",
      data: [
        ...liveStockDetails.map(({ temperature, last_checkup_date }) => ({
          x: last_checkup_date,
          y: temperature,
        })),
        ...liveHistory.temperature,
      ],
    },
  ];

  // ⚖️ Weight stays static
  const lineChartWeight = [
    {
      id: "Weight",
      data: liveStockDetails.map(({ weight, last_checkup_date }) => ({
        x: last_checkup_date,
        y: weight,
      })),
    },
  ];

  // 🐐 Animal info
  const getAnimal = animalDetails.filter((a) => a.animal_id == liveStockId);

  if (getAnimal.length === 0) {
    return <div>No data found for this livestock</div>;
  }

  const animalData = getAnimal[0];

  const displayedData = {
    ...animalData,
    ...(isLive
      ? {
          temperature: `${liveData.temperature?.toFixed(1)} °C (Live)`,
          heart_rate: `${liveData.BPM?.toFixed(0)} bpm (Live)`,
          step_count: `${Math.round(liveData.motion * 10000)} steps (Live)`,
        }
      : {}),
  };

  // 📦 Export Button
  const handleExport = () => {
    const exportData = {
      animalDetails: animalData,
      healthData: liveStockDetails,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `livestock_${liveStockId}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🧩 UI Layout
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar title={"TAGARU TECH"} />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar
          items={[
            { label: "LiveStock Info", redirect: "/1" },
            { label: "Table", redirect: "/" },
            { label: "Farm Details", redirect: "/farmDetails" },
            { label: "GeoFencing", redirect: "/geofencing" },
          ]}
        />
        <main
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            marginLeft: "250px",
          }}
        >
          {/* Animal Info */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                overflowX: "auto",
              }}
            >
              {Object.entries(displayedData).map(([key, value], idx, arr) => (
                <React.Fragment key={key}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 100,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {key.replace(/_/g, " ")}
                    </Typography>
                    {key === "health_condition" ? (
                      <Box
                        sx={{
                          height: 8,
                          width: "100%",
                          bgcolor:
                            value === "healthy" ? "success.main" : "error.main",
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <Typography variant="body1">{value}</Typography>
                    )}
                  </Box>
                  {idx !== arr.length - 1 && (
                    <Divider orientation="vertical" flexItem />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Paper>

          {/* Charts Section */}
          <BarChart key={chartKey + "-bar"} data={barChartStepCount} title="Step Count (Motion)" />
          <LineChart key={chartKey + "-hr"} data={lineChartHeartRate} title="Heart Rate" />
          <LineChart key={chartKey + "-temp"} data={lineChartTemperature} title="Temperature" />
          <LineChart key={chartKey + "-wt"} data={lineChartWeight} title="Weight" />

          {/* Export Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              sx={{ px: 4, py: 1.5 }}
              endIcon={<span style={{ marginLeft: "8px" }}>→</span>}
            >
              Export Data
            </Button>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default LiveStockInfo;
