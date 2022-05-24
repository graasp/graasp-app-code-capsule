import React, { FC, ReactNode } from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material';
import { grey, orange, pink } from '@mui/material/colors';
import { StyledEngineProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  queryClient,
  ReactQueryDevtools,
} from '../config/queryClient';
import { ContextProvider } from './context/ContextContext';

// declare this type to use React v18 with react-query v3
// for reference: https://github.com/tannerlinsley/react-query/issues/3476
declare module 'react-query/types/react/QueryClientProvider' {
  interface QueryClientProviderProps {
    children?: ReactNode;
  }
}

// declare the module to enable theme modification
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: { background: string; color: string };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: { background: string; color: string };
    };
  }

  interface PaletteOptions {
    default: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
    secondary: pink,
    default: grey['500'],
    background: {
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange['400'],
      color: '#fff',
    },
  },
});

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
});

const Root: FC = () => (
  <RootDiv>
    {/* Used to define the order of injected properties between JSS and emotion */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18nConfig}>
          <QueryClientProvider client={queryClient}>
            <ContextProvider>
              <App />
            </ContextProvider>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          </QueryClientProvider>
        </I18nextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </RootDiv>
);

export default Root;
