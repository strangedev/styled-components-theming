import { createGlobalThemeProvider } from '../lib/createGlobalThemeProvider';
import { createLocalTheme } from '../lib/createLocalTheme';

const { GlobalThemeProvider, globalTheme } = createGlobalThemeProvider({
  themes: {
    dark: {
      colors: {
        background: '#000',
        brand: '#f0f',
        text: '#fff'
      }
    },
    light: {
      colors: {
        background: '#fff',
        brand: '#f0f',
        text: '#000'
      }
    }
  },
  variants: [ 'dark', 'light' ],
  defaultVariant: 'dark'
});

const { get } = createLocalTheme({
  globalTheme,
  themeFactory ({ theme, variant }) {
    let textColor = theme.colors.text;

    if (variant === 'light') {
      textColor = theme.colors.background;
    }

    return {
      bla: {
        blub: {
          background: theme.colors.brand,
          color: textColor
        }
      }
    };
  }
});

get(theme => theme.bla.blub.color);
get(theme => theme.bla.blub.background);
