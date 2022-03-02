import { assert } from 'assertthat';
import React from 'react';
import styled from 'styled-components';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createGlobalThemeProvider, createLocalTheme } from '../../lib';
import { Length, px } from '@nhummel/css-in-js';

const configuration = {
  themes: {
    dark: {
      space: (units: number): Length => Length.new(units * 4, px),
      brandColor: '#a5e',
      color: '#e3e3e3',
      background: '#222'
    },
    light: {
      space: (units: number): Length => Length.new(units * 4, px),
      brandColor: '#a5e',
      color: '#222',
      background: '#e3e3e3'
    }
  },
  variants: [ 'dark', 'light' ],
  defaultVariant: 'dark'
};

suite('Component tests', (): void => {
  teardown(async (): Promise<void> => {
    cleanup();
  });

  test('styles styled-components isolated from each other.', async (): Promise<void> => {
    const { globalTheme, GlobalThemeProvider } = createGlobalThemeProvider(configuration);
    const { get: getOne } = createLocalTheme({
      globalTheme,
      themeFactory ({ theme, variant }) {
        const { brandColor, background } = theme;
        let { color } = theme;

        if (variant === 'light') {
          color = background;
        }

        return {
          color,
          background: brandColor,
          padding: theme.space(2)
        };
      }
    });

    const Banner = styled.div`
      color: ${getOne(theme => theme.color)};
      background-color: ${getOne(theme => theme.background)};
      padding: ${getOne(theme => theme.padding)};
    `;

    const { get: getTwo } = createLocalTheme({
      globalTheme,
      themeFactory ({ theme }) {
        return {
          marginLeft: theme.space(16)
        };
      }
    });

    const Logo = styled.div`
      margin-left: ${getTwo(theme => theme.marginLeft)};
    `;

    render((
      <GlobalThemeProvider>
        <Banner data-testid='banner'>Yes yes</Banner>
        <Logo data-testid='logo' />
      </GlobalThemeProvider>
    ));

    await waitFor(async () => {
      const banner = await screen.findByTestId('banner');
      const logo = await screen.findByTestId('logo');

      const bannerStyle = window.getComputedStyle(banner);

      assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
      assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
      assert.that(bannerStyle.padding).is.equalTo('8px');

      const logoStyle = window.getComputedStyle(logo);

      assert.that(logoStyle.marginLeft).is.equalTo('64px');
    });
  });
  suite('useTheme hook', (): void => {
    test('can be used to switch the variant, re-rendering the component.', async (): Promise<void> => {

    });
    test('can be used to obtain the available variants.', async (): Promise<void> => {

    });
    test('can be used to obtain the current variant.', async (): Promise<void> => {

    });
    test('can be used to access the global theme.', async (): Promise<void> => {

    });
  });
});
