import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const CustomModal = ({ isOpen, onClose, children, modalTitle = '' }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Button
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    &times;
                </Button>
                <Typography variant="h6" component="h2" gutterBottom>
                    {modalTitle}
                </Typography>
                {children}
            </Box>
        </Modal>
    );
};

export default CustomModal;