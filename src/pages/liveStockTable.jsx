import React, { useMemo } from 'react';
import Table from '../components/Table';
import Navbar from '../sections/navbar';
import Sidebar from '../sections/sidebar';
import animalDetails from '../data/animal_details.json';
import healthCondition from '../data/health_condition1.json';
import CustomButton from '../components/Button';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Modal } from '@mui/material';

const LiveStockTable = () => {
    const [isOpen, setOpen] = React.useState(false);

    // Merging animal and health data with date
    const mergedAnimalData = useMemo(() => {
        const healthMap = new Map();
        healthCondition.forEach(item => {
            healthMap.set(item.animal_id, item);
        });

        return animalDetails.map(animal => ({
            ...animal,
            ...healthMap.get(animal.animal_id),
            date: new Date().toLocaleDateString(),  // Add date here
        }));
    }, []);

    // Main table columns
    const columns = [
        {
            header: 'ID',
            accessorKey: 'animal_id',
            cell: ({ row }) => (
                <button onClick={() => window.location.href = `/${row.original.animal_id}`}>
                    {row.original.animal_id}
                </button>
            ),
        },
        { header: 'Breed', accessorKey: 'breed' },
        { header: 'Weight', accessorKey: 'weight' },
        { header: 'Age', accessorKey: 'age' },
        { header: 'Gender', accessorKey: 'gender' },
        {
            header: 'Health Status',
            accessorKey: 'health_condition',
            cell: ({ row }) => {
                const status = row.original.health_condition || 'unknown';
                const color = status === 'healthy' ? 'green' : 'red';
                return (
                    <div style={{
                        width: '80px',
                        height: '25px',
                        backgroundColor: color,
                        borderRadius: '4px'
                    }} />
                );
            }
        },
    ];

    // All animals healthy check
    const AreAnimalsHealthy = useMemo(() => {
        return healthCondition.every(animal => animal.health_condition === 'healthy');
    }, []);

    // Modal table: Only Alerts with Date
    const unHealthyAnimalsColumn = [
        {
            header: 'ID',
            accessorKey: 'animal_id',
            cell: ({ row }) => (
                <button onClick={() => window.location.href = `/${row.original.animal_id}`}>
                    {row.original.animal_id}
                </button>
            ),
        },
        {
            header: 'Alerts',
            accessorKey: 'alerts',
            cell: ({ row }) => {
                const { temperature, heart_rate, step_count } = row.original;
                const alerts = [];

                // Thresholds
                const tempThreshold = 40;
                const hrThreshold = 110;
                const stepThreshold = 500;

                if (temperature > tempThreshold)
                    alerts.push(`🔥 High Temp: ${temperature}°C`);
                if (heart_rate > hrThreshold)
                    alerts.push(`💓 High HR: ${heart_rate} bpm`);
                if (step_count < stepThreshold)
                    alerts.push(`👣 Low Steps: ${step_count}`);

                return (
                    <ul style={{ margin: 0, paddingLeft: '16px', color: alerts.length ? 'red' : 'green' }}>
                        {alerts.length > 0 ? alerts.map((a, i) => <li key={i}>{a}</li>) : <li>No Alerts</li>}
                    </ul>
                );
            }
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ row }) => row.original.last_checkup_date
        }
    ];

    // Unhealthy animals
    const unHealthyAnimalsDetails = useMemo(() => {
        const filteredData = healthCondition.filter(animal => animal.health_condition !== 'healthy');
        return removeDuplicates(filteredData, 'animal_id');
    }, []);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Navbar title={'TAGARU TECH'} />
                <div style={{ flex: 1, display: 'flex' }}>
                  <Sidebar items={[{ label: "LiveStock Info", redirect: "/1" }, { label: "Table", redirect: "/" }, {label: "Farm Details", redirect: "/farmDetails"}, {label: "GeoFencing", redirect: "/geofencing"}]} />
                    <main style={{ flex: 1, padding: '20px', overflowY: 'auto', marginLeft: '250px' }}>
                        {AreAnimalsHealthy ?
                            <CustomButton color='success' icon={<TaskAltIcon />} children={'All good'} onClick={() => setOpen(!isOpen)} />
                            : <CustomButton color='error' icon={<CloseIcon />} children={'Needs Attention'} onClick={() => setOpen(!isOpen)} />}
                        <Table
                            columns={columns}
                            data={mergedAnimalData}
                            rowClassName={({ original }) =>
                                original.health_condition === 'healthy' ? 'row-green' : 'row-red'
                            }
                        />
                    </main>
                </div>
            </div>

            {/* Modal for Unhealthy Animals */}
            <Modal open={isOpen} onClose={() => setOpen(!isOpen)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    height: 'auto',
                    border: '2px solid #000',
                    background: '#fff',
                    overflow: 'hidden'
                }}>
                    <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
                        <Table columns={unHealthyAnimalsColumn} data={unHealthyAnimalsDetails} />
                    </div>
                </Box>
            </Modal>

            <style>
                {`
                    .row-green {
                        background-color: #d4edda !important;
                    }
                    .row-red {
                        background-color: #f8d7da !important;
                    }
                `}
            </style>
        </>
    );
};

export default LiveStockTable;

const removeDuplicates = (data, key) => {
    const seen = new Set();
    return data.filter(item => {
        const uniqueValue = item[key];
        if (seen.has(uniqueValue)) return false;
        seen.add(uniqueValue);
        return true;
    });
};
