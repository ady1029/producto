import { createMuiTheme } from '@material-ui/core/styles';


const Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#007E9E',
    },
    secondary: {
      main: '#359BB5',
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      }
    },
  }
})

export default Theme;