// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    direction: 'rtl', // תמיכה מובנית בכיווניות מימין לשמאל
    palette: {
        primary: {
            main: '#1976d2', // כחול ראשי
        },
        secondary: {
            main: '#dc004e', // ורוד/אדום משני
        },
        background: {
            default: '#f4f6f8', // רקע כללי של הדפים
            paper: '#ffffff',   // רקע של "קלפים" ורכיבים
        },
    },
    typography: {
        fontFamily: 'Heebo, Arial, sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
});