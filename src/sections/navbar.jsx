import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    Box,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';
import goatLogo from '../assets/img.PNG';
import { useTranslation } from 'react-i18next';

const Navbar = ({ title }) => {
    const { t, i18n } = useTranslation();
    const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [themesAnchorEl, setThemesAnchorEl] = useState(null);

    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem('themeMode') || 'light';
    });

    const openSettings = Boolean(settingsAnchorEl);
    const openProfile = Boolean(profileAnchorEl);
    const openLanguage = Boolean(languageAnchorEl);
    const openThemes = Boolean(themesAnchorEl);

    const handleMenuClick = (setter) => (event) => {
        setter(event.currentTarget);
    };

    const handleClose = () => {
        setSettingsAnchorEl(null);
        setProfileAnchorEl(null);
        setLanguageAnchorEl(null);
        setThemesAnchorEl(null);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        handleClose();
    };

    const changeThemeMode = (mode) => {
        setThemeMode(mode);
        localStorage.setItem('themeMode', mode);
        handleClose();
        console.log('Theme changed to:', mode);
    };

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'kn', name: 'ಕನ್ನಡ' }
    ];

    return (
        <AppBar position="static" style={{ backgroundColor: '#659bdf' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display="flex" alignItems="center">
                    <img 
                        src={goatLogo} 
                        alt={t('logoAlt')} 
                        style={{ height: '50px', marginRight: '16px', borderRadius: '8px' }} 
                    />
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    {/* Profile Menu */}
                    <Tooltip title={t('Profile')}>
                        <IconButton color="inherit" onClick={handleMenuClick(setProfileAnchorEl)}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={profileAnchorEl}
                        open={openProfile}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => console.log("View Profile")}>
                            {t('View Profile')}
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Edit Profile")}>
                            {t('Edit Profile')}
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Change Password")}>
                            {t('Change Password')}
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => console.log("Logout")}>
                            {t('Logout')}
                        </MenuItem>
                    </Menu>

                    {/* Settings Menu */}
                    <Tooltip title={t('Settings')}>
                        <IconButton color="inherit" onClick={handleMenuClick(setSettingsAnchorEl)}>
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={settingsAnchorEl}
                        open={openSettings}
                        onClose={handleClose}
                    >
                        {/* Themes submenu trigger */}
                        <MenuItem onClick={handleMenuClick(setThemesAnchorEl)}>
                            {t('Themes')}
                        </MenuItem>

                        {/* Themes Submenu */}
                        <Menu
                            anchorEl={themesAnchorEl}
                            open={openThemes}
                            onClose={() => setThemesAnchorEl(null)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            <MenuItem 
                                selected={themeMode === 'light'}
                                onClick={() => changeThemeMode('light')}
                            >
                                {t('Light Mode')}
                            </MenuItem>
                            <MenuItem 
                                selected={themeMode === 'dark'}
                                onClick={() => changeThemeMode('dark')}
                            >
                                {t('Dark Mode')}
                            </MenuItem>
                        </Menu>

                        <MenuItem onClick={handleMenuClick(setLanguageAnchorEl)}>
                            <ListItemText>{t('Language')}</ListItemText>
                            <ListItemIcon style={{ minWidth: 'auto', marginLeft: '16px' }}>
                                <LanguageIcon fontSize="small" />
                            </ListItemIcon>
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Notifications")}>
                            {t('Notifications')}
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => console.log("Help & Support")}>
                            {t('Help Support')}
                        </MenuItem>
                    </Menu>

                    {/* Language Submenu */}
                    <Menu
                        anchorEl={languageAnchorEl}
                        open={openLanguage}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {languages.map((language) => (
                            <MenuItem 
                                key={language.code} 
                                onClick={() => changeLanguage(language.code)}
                            >
                                <ListItemText>{language.name}</ListItemText>
                                <ListItemIcon style={{ minWidth: 'auto', marginLeft: '16px' }}>
                                    {i18n.language === language.code && <CheckIcon fontSize="small" />}
                                </ListItemIcon>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
