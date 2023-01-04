/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { colors, createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import typography from './typography';
import { softShadows } from './shadows';

const baseConfig = {
  direction: 'ltr',
  typography,
  overrides: {
    MuiLinearProgress: {
      root: {
        borderRadius: 3,
        overflow: 'hidden'
      }
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32
      }
    },
    MuiChip: {
      root: {
        backgroundColor: 'rgba(0,0,0,0.075)'
      }
    }
  }
};

const themeConfigs = {
  name: 'LIGHT',
  overrides: {
    MuiInputBase: {
      input: {
        '&::placeholder': {
          opacity: 1,
          color: colors.blueGrey[600]
        }
      }
    }
  },
  palette: {
    type: 'light',
    action: {
      active: colors.blueGrey[600]
    },
    background: {
      default: colors.common.white,
      dark: '#f4f6f8',
      paper: colors.common.white
    },
    primary: {
      main: colors.indigo[600]
    },
    secondary: {
      main: '#5850EC'
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows: softShadows
}

export function createTheme(settings = {}) {
  let themeConfig = themeConfigs;

  if (!themeConfig) {
    console.warn(new Error(`The theme ${settings.theme} is not valid`));
    [themeConfig] = themeConfigs;
  }

  let theme = createMuiTheme(
    _.merge(
      {},
      baseConfig,
      themeConfig,
      { direction: settings.direction }
    )
  );

  if (settings.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
}
