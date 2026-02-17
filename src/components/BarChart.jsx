import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Typography } from '@mui/material';
import useLiveData from './useLiveData';

const BarChart = ({ data: initialData, title }) => {
  const liveData = useLiveData();
  const [chartData, setChartData] = useState(initialData);

  // Add new live data to the end dynamically
  useEffect(() => {
    if (liveData && liveData.motion !== undefined) {
      const newLabel = new Date().toLocaleTimeString();

      // Convert motion (0.12 type) → realistic steps (~12,000)
      const newValue = Math.round(liveData.motion * 100000);

      setChartData((prev) => [
        ...prev,
        { Label: newLabel, value: newValue },
      ]);
    }
  }, [liveData]);

  return (
    <div style={{ height: 400 }}>
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
      <ResponsiveBar
        data={chartData}
        keys={['value']}
        indexBy="Label"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Label',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default BarChart;
