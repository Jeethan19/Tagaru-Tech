import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../sections/navbar';
import Sidebar from '../sections/sidebar';

const FenceDrawer = ({ fence, setFence }) => {
  useMapEvents({
    click(e) {
      setFence([...fence, [e.latlng.lat, e.latlng.lng]]);
    }
  });
  return null;
};

const isPointInPolygon = (point, polygon) => {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const generateAnimalPositions = (fence, count = 15) => {
  if (fence.length < 3) return [];

  const lats = fence.map(p => p[0]);
  const lngs = fence.map(p => p[1]);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const buffer = 0.001;
  const insideCount = Math.floor(count * 0.7);
  const outsideCount = count - insideCount;

  const ids = Array.from({ length: count }, (_, i) => `ID_${String(i).padStart(1, '0')}`);
  const shuffledIDs = shuffleArray(ids);

  const animals = [];
  let index = 0;

  let insideGenerated = 0;
  while (insideGenerated < insideCount) {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    if (isPointInPolygon([lat, lng], fence)) {
      const idName = shuffledIDs[index];
      const num = idName.split('_')[1];
      animals.push({
        position: [lat, lng],
        isInside: true,
        id: `animal-inside-${insideGenerated}`,
        name: idName,
        device: `Collar ${num}`
      });
      insideGenerated++;
      index++;
    }
  }

  let outsideGenerated = 0;
  while (outsideGenerated < outsideCount) {
    const lat = minLat - buffer + Math.random() * (maxLat - minLat + buffer * 2);
    const lng = minLng - buffer + Math.random() * (maxLng - minLng + buffer * 2);
    if (!isPointInPolygon([lat, lng], fence)) {
      const idName = shuffledIDs[index];
      const num = idName.split('_')[1];
      animals.push({
        position: [lat, lng],
        isInside: false,
        id: `animal-outside-${outsideGenerated}`,
        name: idName,
        device: `Collar ${num}`
      });
      outsideGenerated++;
      index++;
    }
  }

  return animals;
};

const GeoFencing = () => {
  const [fence, setFence] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const savedFence = localStorage.getItem('savedFence');
    if (savedFence) {
      const parsedFence = JSON.parse(savedFence);
      setFence(parsedFence);
      setIsLocked(true);
      setIsDrawing(false);
    }
  }, []);

  useEffect(() => {
    if (fence.length > 2) {
      setAnimals(generateAnimalPositions(fence));
    } else {
      setAnimals([]);
    }
  }, [fence]);

  const handleSaveFence = () => {
    localStorage.setItem('savedFence', JSON.stringify(fence));
    setIsLocked(true);
    setIsDrawing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setFence([]);
    setAnimals([]);
    localStorage.removeItem('savedFence');
    setIsLocked(false);
  };

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
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Geo-Fencing
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setIsDrawing(!isDrawing)}
                  color={isDrawing ? 'error' : 'primary'}
                  disabled={isLocked}
                >
                  {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
                </Button>
                {fence.length > 0 && (
                  <>
                    <Button variant="outlined" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button variant="contained" color="success" onClick={handleSaveFence} disabled={isLocked}>
                      Save Fence
                    </Button>
                  </>
                )}
              </Box>

              <Box sx={{ position: 'absolute', right: 60, width: '300px' }}>
                <Collapse in={saveSuccess}>
                  <Alert
                    severity="success"
                    onClose={() => setSaveSuccess(false)}
                    sx={{ py: 0.5, '& .MuiAlert-message': { padding: '4px 0' } }}
                  >
                    Fence saved successfully!
                  </Alert>
                </Collapse>
              </Box>
            </Box>

            <Box sx={{ height: '500px', mt: 2, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={[12.9716, 77.5946]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {fence.length > 0 && (
                  <Polygon positions={fence} color="red" fillOpacity={0.2} />
                )}
                {animals.map(animal => (
                  <CircleMarker
                    key={animal.id}
                    center={animal.position}
                    radius={3}
                    fillOpacity={1}
                    color={animal.isInside ? 'green' : 'red'}
                    fillColor={animal.isInside ? 'green' : 'red'}
                  >
                    <Popup>
                      {animal.name} - {animal.isInside ? 'Inside' : 'Outside'} fence
                    </Popup>
                  </CircleMarker>
                ))}
                {isDrawing && !isLocked && <FenceDrawer fence={fence} setFence={setFence} />}
              </MapContainer>
            </Box>

            {fence.length > 0 && (
              <>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Fence points: {JSON.stringify(fence)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Animals inside: {animals.filter(a => a.isInside).length} (green) |
                    Animals outside: {animals.filter(a => !a.isInside).length} (red)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Typography variant="h6" sx={{ backgroundColor: 'green', color: 'white', p: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                      Safe Livestock
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Animal ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Device</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {animals.filter(a => a.isInside).map(animal => (
                            <TableRow key={animal.id}>
                              <TableCell>{animal.name}</TableCell>
                              <TableCell>{animal.device}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 300 }}>
                    <Typography variant="h6" sx={{ backgroundColor: 'red', color: 'white', p: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                      Unsafe Livestock
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Animal ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Device</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {animals.filter(a => !a.isInside).map(animal => (
                            <TableRow key={animal.id}>
                              <TableCell>{animal.name}</TableCell>
                              <TableCell>{animal.device}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </main>
      </div>
    </div>
  );
};

export default GeoFencing;
