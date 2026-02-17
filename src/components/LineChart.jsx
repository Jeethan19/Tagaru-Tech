import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Typography } from "@mui/material";
import useLiveData from "./useLiveData";

const LineChart = ({ data: initialData, title, type }) => {
  const liveData = useLiveData();
  const [chartData, setChartData] = useState(initialData);

  useEffect(() => {
    if (!liveData) return;

    const timestamp = new Date().toLocaleTimeString();

    // Handle different chart types (Temperature or Heart Rate)
    if (type === "temperature" && liveData.temperature) {
      setChartData((prev) =>
        prev.map((series) =>
          series.id === "Temperature"
            ? {
                ...series,
                data: [...series.data, { x: timestamp, y: liveData.temperature }],
              }
            : series
        )
      );
    }

    if (type === "heartbeat" && liveData.BPM) {
      setChartData((prev) =>
        prev.map((series) =>
          series.id === "Heart Rate"
            ? {
                ...series,
                data: [...series.data, { x: timestamp, y: liveData.BPM }],
              }
            : series
        )
      );
    }
  }, [liveData, type]);

  return (
    <div style={{ height: "400px" }}>
      {title && (
        <Typography
          variant="subtitle2"
          align="left"
          marginTop={5}
          marginBottom={-5}
        >
          {title}
        </Typography>
      )}
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "X-axis",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Y-axis",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        colors={{ scheme: "nivo" }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
