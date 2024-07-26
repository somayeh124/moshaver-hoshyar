import { useMemo } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import { styled, createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

import { palette } from './palette';
import { shadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
// Import your font file
import PeydaWeb from '../../public/assets/PeydaWeb/woff/PeydaWeb-Black.woff';

// ----------------------------------------------------------------------

const GlobalStyle = styled('div')({
  '@global': {
    '@font-face': {
      fontFamily: 'PeydaWeb-Black.woff',
      src: `url(${PeydaWeb}) format('woff')`,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontDisplay: 'swap',
    },
    'body': {
      fontFamily: 'PeydaWeb, Arial, sans-serif',
    },
  },
});

export default function ThemeProvider({ children }) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const theme = createTheme(memoizedValue, { direction: 'rtl' });

  theme.components = overrides(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle/> 
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
