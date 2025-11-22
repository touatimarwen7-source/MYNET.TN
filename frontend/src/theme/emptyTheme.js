import { createTheme } from '@mui/material/styles';

/**
 * EMPTY THEME - BASE FOR CUSTOMIZATION
 * سيتم تخصيص جميع المظهر من الصفر
 */

const emptyTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
  },
});

export default emptyTheme;
