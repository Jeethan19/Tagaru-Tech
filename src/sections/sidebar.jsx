import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemButton, Box } from '@mui/material';

const Sidebar = ({ items, style }) => {
    const location = useLocation();

    return (
        <div style={{ 
            width: '250px',
            backgroundColor: '#f4f4f4',
            height: '100vh',
            position: 'fixed',
            overflowY: 'auto',
            ...style, 
        }}>
            <List>
                {items?.map((item, index) => {
                    const isActive = location.pathname === item.redirect;
                    return (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.redirect}
                                sx={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    position: 'relative',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                    backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '12px',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: isActive ? 'primary.main' : 'transparent',
                                    }}
                                />
                                <ListItemText 
                                    primary={item.label} 
                                    sx={{
                                        paddingLeft: '24px',
                                        '& .MuiTypography-root': {
                                            fontWeight: isActive ? '600' : '400',
                                        }
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

Sidebar.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            redirect: PropTypes.string,
        })
    ).isRequired,
    style: PropTypes.object,
};

Sidebar.defaultProps = {
    style: {},
};

export default Sidebar;