// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Azul padrão
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#dc004e', // Rosa padrão
            contrastText: '#ffffff',
        },
        success: {
            main: '#4caf50',
        },
        error: {
            main: '#f44336',
        },
        info: {
            main: '#2196f3',
        },
        warning: {
            main: '#ff9800',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
    },
});

export default theme;
