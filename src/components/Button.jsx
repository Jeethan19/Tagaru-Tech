import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const CustomButton = ({
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    children,
    icon,
    ...rest
}) => {
    return (
        <Button
            variant={variant}
            color={color}
            size={size}
            onClick={onClick}
            disabled={disabled}
            startIcon={icon}
            {...rest}
        >
            {children}
        </Button>
    );
};

CustomButton.propTypes = {
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    color: PropTypes.oneOf(['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    // children: PropTypes.node.isRequired,
};

export default CustomButton;