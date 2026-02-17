import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Button
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import Navbar from '../sections/navbar';
import Sidebar from '../sections/sidebar';
import farmPhoto from '../assets/farmphoto.png';
import farmLocationPhoto from '../assets/farmlocation.png';
import livingCondition from '../data/living_condition.json';

const FarmDetails = () => {
  const farm = {
    ID: 'FARM001',
    Farm_Name: 'Arun Sheep Farms',
    Owner: 'SR Arun',
    Phone: '9353719056',
    email: 'arunfarms@gmail.com',
    Size: '2.5 acres',
    Location: 'Nagwara, Banglore',
    Established: '2021',
    Documents: 'https://drive.google.com/file'
  };

  // Options for dropdowns
  const options = {
    bedding_type: ['hay', 'straw', 'sand', 'wood shavings', 'rubber mats'],
    bedding_change_frequency: ['daily', 'weekly', 'bi-weekly', 'monthly', 'as needed'],
    ventilation_type: ['natural', 'mechanical', 'mixed'],
    ventilation_frequency: ['continuous', 'periodic', 'manual'],
    cleaning_schedule: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    pest_control_type: ['pesticide', 'biological', 'mechanical', 'none'],
    pest_control_frequency: ['daily', 'weekly', 'monthly', 'seasonally']
  };

  const [managementValues, setManagementValues] = useState({
    bedding_type: "hay",
    bedding_change_frequency: "weekly",
    ventilation_type: "natural",
    ventilation_frequency: "periodic",
    cleaning_schedule: "weekly",
    pest_control_type: "pesticide",
    pest_control_frequency: "weekly"
  });

  // Process environment data with error handling
  const { temperatureChartData, humidityChartData } = useMemo(() => {
    const defaultData = { temperatureChartData: [], humidityChartData: [] };

    try {
      const validData = livingCondition.filter(
        item => item.temperature_range !== undefined && 
               item.humidity_level !== undefined && 
               item.time
      );

      if (validData.length === 0) return defaultData;

      return {
        temperatureChartData: [{
          id: 'Temperature',
          data: validData.map(item => ({
            x: item.time,
            y: item.temperature_range
          }))
        }],
        humidityChartData: [{
          id: 'Humidity',
          data: validData.map(item => ({
            x: item.time,
            y: item.humidity_level
          }))
        }]
      };
    } catch (error) {
      console.error('Error processing data:', error);
      return defaultData;
    }
  }, []);

  const handleChange = (field, value) => {
    setManagementValues(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const exportData = {
      farmDetails: farm,
      managementValues,
      environmentData: livingCondition
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'farm_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Updated Line chart component with requested changes
  const LineChart = ({ data, title }) => (
    <Paper elevation={3} sx={{ p: 2, mb: 3, height: '400px' }}>
      <Typography variant="subtitle1" gutterBottom>{title}</Typography>
      <div style={{ height: '350px' }}>
        {data.length > 0 ? (
          <ResponsiveLine
            data={data}
            margin={{ top: 25, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
            }}
            curve="linear"
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Time',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: title === 'Temperature' ? '°C' : '%',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={title === 'Temperature' ? '#FF5733' : '#3385FF'} // Custom colors
            lineWidth={3}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enablePointLabel={false} // Disabled point labels
            pointSymbol={({ size, color, borderWidth, borderColor }) => (
              <circle
                r={size / 2}
                fill={color}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            )}
            useMesh={true}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 12,
                    fill: '#666'
                  }
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fill: '#333'
                  }
                }
              },
              grid: {
                line: {
                  stroke: '#ddd',
                  strokeWidth: 1
                }
              }
            }}
          />
        ) : (
          <Typography>No data available</Typography>
        )}
      </div>
    </Paper>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar title="TAGARU TECH" />
      <div style={{ flex: 1, display: 'flex' }}>
        <Sidebar items={[
          { label: "LiveStock Info", redirect: "/1" },
          { label: "Table", redirect: "/" },
          { label: "Farm Details", redirect: "/farmDetails" },
          { label: "GeoFencing", redirect: "/geofencing" }
        ]} />

        <main style={{ flex: 1, padding: '20px', overflowY: 'auto', marginLeft: '250px' }}>
          <Typography variant="h4" gutterBottom>Hello Arun!</Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Left Column - Tables */}
            <Box sx={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Paper elevation={3} sx={{ p: 1.5 }}>
                <Typography variant="h6">Farm Details</Typography>
                <Divider sx={{ my: 1 }} />
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {Object.entries(farm).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell sx={{ fontWeight: '700' }}>
                            {key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">Farm Management</Typography>
                <Divider sx={{ my: 1 }} />
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      {Object.entries(managementValues).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell sx={{ fontWeight: '700' }}>
                            {key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                              >
                                {options[key].map(option => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>

            {/* Right Column - Photos */}
            <Box sx={{ flex: 1, minWidth: '600px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Paper elevation={3} sx={{ p: 1 }}>
                <Typography variant="h6">Farm Photo</Typography>
                <Divider sx={{ my: 1 }} />
                <img src={farmPhoto} alt="Farm" style={{ width: '100%', height: '300px', objectFit: 'contain' }} />
              </Paper>
              <Paper elevation={3} sx={{ p: 1 }}>
                <Typography variant="h6">Farm Location</Typography>
                <Divider sx={{ my: 1 }} />
                <img src={farmLocationPhoto} alt="Location" style={{ width: '100%', height: '381px', objectFit: 'contain' }} />
              </Paper>
            </Box>
          </Box>

          {/* Charts Section */}
          <Box sx={{ mt: 3 }}>
            <LineChart data={temperatureChartData} title="Temperature" />
            <LineChart data={humidityChartData} title="Humidity" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleExport}
              endIcon={<span>→</span>}
            >
              Export Data
            </Button>
          </Box>
        </main>
      </div>
    </div>
  );
};

export default FarmDetails;