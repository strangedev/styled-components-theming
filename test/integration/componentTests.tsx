import { assert } from 'assertthat';
import styled from 'styled-components';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { createGlobalTheme, createLocalTheme } from '../../lib';
import { Length, px } from '@nhummel/css-in-js';
import React, { FunctionComponent } from 'react';

const configuration = {
  globalThemes: {
    dark: {
      space: (units: number): Length => Length.new(units * 4, px),
      brandColor: '#a5e',
      color: '#e3e3e3',
      background: '#222'
    },
    light: {
      space: (units: number): Length => Length.new(units * 8, px),
      brandColor: '#a5e',
      color: '#222',
      background: '#e3e3e3'
    }
  },
  variants: [ 'dark', 'light' ] as const,
  defaultVariant: 'dark' as const
};

suite('Component tests', (): void => {
  teardown(async (): Promise<void> => {
    cleanup();
  });

  test('styles styled-components isolated from each other.', async (): Promise<void> => {
    const { globalThemeContext, GlobalThemeProvider } = createGlobalTheme(configuration);
    const { from: fromOne } = createLocalTheme({
      globalThemeContext,
      factory ({ globalTheme, variant }) {
        const { brandColor, background } = globalTheme;
        let { color } = globalTheme;

        if (variant === 'light') {
          color = background;
        }

        return {
          color,
          background: brandColor,
          padding: globalTheme.space(2)
        };
      }
    });

    const Banner = styled.div`
      color: ${fromOne(theme => theme.color)};
      background-color: ${fromOne(theme => theme.background)};
      padding: ${fromOne(theme => theme.padding)};
    `;

    const { from: fromTwo } = createLocalTheme({
      globalThemeContext,
      factory ({ globalTheme }) {
        return {
          marginLeft: globalTheme.space(16)
        };
      }
    });

    const Logo = styled.div`
      margin-left: ${fromTwo(theme => theme.marginLeft)};
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
      const { globalThemeContext, GlobalThemeProvider, useTheme } = createGlobalTheme(configuration);
      const { from } = createLocalTheme({
        globalThemeContext,
        factory ({ globalTheme, variant }) {
          const { brandColor, background } = globalTheme;
          let { color } = globalTheme;

          if (variant === 'light') {
            color = background;
          }

          return {
            color,
            background: brandColor,
            padding: globalTheme.space(2)
          };
        }
      });

      const Banner = styled.div`
        color: ${from(theme => theme.color)};
        background-color: ${from(theme => theme.background)};
        padding: ${from(theme => theme.padding)};
      `;

      const ThemeSwitch: FunctionComponent = () => {
        const { switchVariant } = useTheme();

        return (
          <button
            data-testid='switchTheme'
            onClick={ (): void => switchVariant('light') }
          >
            Switch theme
          </button>
        );
      };

      render((
        <GlobalThemeProvider>
          <Banner data-testid='banner'>Yes yes</Banner>
          <ThemeSwitch />
        </GlobalThemeProvider>
      ));

      await waitFor(async () => {
        const banner = await screen.findByTestId('banner');
        const bannerStyle = window.getComputedStyle(banner);

        assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
        assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
        assert.that(bannerStyle.padding).is.equalTo('8px');
      });

      await waitFor(async () => {
        const switchButton = await screen.findByTestId('switchTheme');

        act(() => {
          switchButton.click();
        });
      });

      await new Promise((resolve): void => {
        setTimeout(resolve, 300);
      });

      await waitFor(async () => {
        const banner = await screen.findByTestId('banner');
        const bannerStyle = window.getComputedStyle(banner);

        assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
        assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
        assert.that(bannerStyle.padding).is.equalTo('16px');
      });
    });
    test('can be used to obtain the available variants.', async (): Promise<void> => {
      const { GlobalThemeProvider, useTheme } = createGlobalTheme(configuration);

      const Dummy: FunctionComponent = () => {
        const { availableVariants } = useTheme();

        return (
          <div
            data-testid='value'
            data-availablevariants={ JSON.stringify(availableVariants) }
          />
        );
      };

      render((
        <GlobalThemeProvider>
          <Dummy />
        </GlobalThemeProvider>
      ));

      await waitFor(async () => {
        const dummy = await screen.findByTestId('value');
        const actual = dummy.dataset.availablevariants;

        assert.that(actual).is.equalTo(JSON.stringify(configuration.variants));
      });
    });
    test('can be used to obtain the current variant.', async (): Promise<void> => {
      const { GlobalThemeProvider, useTheme } = createGlobalTheme(configuration);

      const Dummy: FunctionComponent = () => {
        const { variant } = useTheme();

        return (
          <div
            data-testid='value'
            data-variant={ variant }
          />
        );
      };

      render((
        <GlobalThemeProvider>
          <Dummy />
        </GlobalThemeProvider>
      ));

      await waitFor(async () => {
        const dummy = await screen.findByTestId('value');
        const actual = dummy.dataset.variant;

        assert.that(actual).is.equalTo(configuration.defaultVariant);
      });
    });
    test('can be used to access the global theme.', async (): Promise<void> => {
      const { GlobalThemeProvider, useTheme } = createGlobalTheme(configuration);

      const Dummy: FunctionComponent = () => {
        const { globalTheme } = useTheme();

        return (
          <div
            data-testid='value'
            data-theme={ JSON.stringify(globalTheme) }
          />
        );
      };

      render((
        <GlobalThemeProvider>
          <Dummy />
        </GlobalThemeProvider>
      ));

      await waitFor(async () => {
        const dummy = await screen.findByTestId('value');
        const actual = dummy.dataset.theme;

        assert.that(actual).is.equalTo(JSON.stringify(configuration.globalThemes[configuration.defaultVariant]));
      });
    });
  });
  suite('createLocalTheme', (): void => {
    test('the theme factory can be a function with arbitrary logic.', async (): Promise<void> => {
      const { globalThemeContext, GlobalThemeProvider } = createGlobalTheme(configuration);
      const { from } = createLocalTheme({
        globalThemeContext,
        factory ({ globalTheme, variant }) {
          const { brandColor, background } = globalTheme;
          let { color } = globalTheme;

          if (variant === 'light') {
            color = background;
          }

          return {
            color,
            background: brandColor,
            padding: globalTheme.space(2)
          };
        }
      });

      const Banner = styled.div`
        color: ${from(theme => theme.color)};
        background-color: ${from(theme => theme.background)};
        padding: ${from(theme => theme.padding)};
      `;

      render((
        <GlobalThemeProvider>
          <Banner data-testid='banner'>Yes yes</Banner>
        </GlobalThemeProvider>
      ));

      await waitFor(async () => {
        const banner = await screen.findByTestId('banner');

        const bannerStyle = window.getComputedStyle(banner);

        assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
        assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
        assert.that(bannerStyle.padding).is.equalTo('8px');
      });
    });
    suite('from function', (): void => {
      test('allows access to values in the local theme.', async (): Promise<void> => {
        const { globalThemeContext, GlobalThemeProvider } = createGlobalTheme(configuration);
        const { from } = createLocalTheme({
          globalThemeContext,
          factory ({ globalTheme, variant }) {
            const { brandColor, background } = globalTheme;
            let { color } = globalTheme;

            if (variant === 'light') {
              color = background;
            }

            return {
              color,
              background: brandColor,
              padding: globalTheme.space(2)
            };
          }
        });

        const Banner = styled.div`
          color: ${from(theme => theme.color)};
          background-color: ${from(theme => theme.background)};
          padding: ${from(theme => theme.padding)};
        `;

        render((
          <GlobalThemeProvider>
            <Banner data-testid='banner'>Yes yes</Banner>
          </GlobalThemeProvider>
        ));

        await waitFor(async () => {
          const banner = await screen.findByTestId('banner');

          const bannerStyle = window.getComputedStyle(banner);

          assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
          assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
          assert.that(bannerStyle.padding).is.equalTo('8px');
        });
      });
      test('allows access to functions in the local theme.', async (): Promise<void> => {
        const { globalThemeContext, GlobalThemeProvider } = createGlobalTheme(configuration);
        const { from } = createLocalTheme({
          globalThemeContext,
          factory ({ globalTheme, variant }) {
            const { brandColor, background, space } = globalTheme;
            let { color } = globalTheme;

            if (variant === 'light') {
              color = background;
            }

            return {
              color,
              background: brandColor,
              padding: space
            };
          }
        });

        const Banner = styled.div`
          color: ${from(theme => theme.color)};
          background-color: ${from(theme => theme.background)};
          padding: ${from(theme => theme.padding(3))};
        `;

        render((
          <GlobalThemeProvider>
            <Banner data-testid='banner'>Yes yes</Banner>
          </GlobalThemeProvider>
        ));

        await waitFor(async () => {
          const banner = await screen.findByTestId('banner');

          const bannerStyle = window.getComputedStyle(banner);

          assert.that(bannerStyle.color).is.equalTo('rgb(227, 227, 227)');
          assert.that(bannerStyle.background).is.equalTo('rgb(170, 85, 238)');
          assert.that(bannerStyle.padding).is.equalTo('12px');
        });
      });
    });
  });
});
