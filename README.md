# styled-components-theming

Application-wide theming with component-level isolation for styled-components.

## Status

| Category | Status                                                                                                                                      |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| Version  | [![npm](https://img.shields.io/npm/v/@nhummel/styled-components-theming)](https://www.npmjs.com/package/@nhummel/styled-components-theming) |
| Build    | ![GitHub Actions](https://github.com/strangedev/styled-components-theming/workflows/Release/badge.svg?branch=main)                          |
| License  | ![GitHub](https://img.shields.io/github/license/strangedev/styled-components-theming)                                                       |

## Introduction

When we say "theming", we think of a uniform design, applied application-wide.
Like most styling solutions, styled-components has facilities for theming,
allowing us to pass a `theme` object implicitly to all styled components.

While this approach is how most frameworks handle theming, we feel this approach
lacks nuance. It is true that the foundation of every design is shared sizes,
colors, fonts and so on, those things alone do not make a functioning stylesheet.
The reality is that most component's styles are very messy and a great deal of
detail work is needed to get the desired result.

Instead of thinking of theming in two layers, the global, shared theme and the
isolated, technical implementation of concrete stylesheets, we want to propose
a slightly different approach.

We think of theming consisting of three layers: The global theme, the local
theme that defines which parts of the global theme should be used and in what
capacity, and the technical implementation of the stylesheet itself.

In our view, the three layers should concern themselves with the following
responsibilities:

The **global theme** should provide basic shared values of the design, like
a unit length, color palette, font families, sizes and weights and so on.
It does not know about any particular components and their details.

The **local theme** is derived from the global theme and is specific to one
component. It is responsible for turning the abstract global theme into a theme
tailored to this component. While we may define a color palette in the global
theme, it is the job of the local theme to define what parts of its component
use which color from the palette.

The **stylesheet** is derived from the local theme and its sole purpose is
translating the domain-oriented local theme into CSS. It should not contain any
logic.

We make this distinction to de-clutter the global theme and the stylesheet.
In our experience, not having isolated local theme leads to several code smells:

- Component-specific code start accumulating in the global theme.
- As a consequence, the global theme becomes very large and increasingly nested, leading to:
    - several teams owning parts of the global theme and nobody knowing which parts are actually needed.
    - duplicated code in the global theme, because it is easier to just add what you need rather than looking for an already existing part to use.
- Special cases are handled inside the stylesheet code, making it hard to read.
    - These special cases are also duplicated because code sharing between styled components is not intuitive.

## Getting started

First, install the package.

```shell
npm install @nhummel/styled-components-theming
```

### Create the global theme and variants

To start off, you need to define the global theme. Note that there may be multiple
variants of this theme. All variants share the same structure, but may contain
different values. You can implement a dark mode, or re-skin your application with
these.

```tsx
// style/globalTheme.ts

const {
  createGlobalStyle,
  createLocalTheme,
  GlobalThemeProvider,
  useTheme
} = createGlobalTheme({
  globalThemes: {
    dark: {
      space: (units: number): string => `${units * 4}px`,
      brandColor: '#a5e',
      color: '#e3e3e3',
      background: '#222'
    },
    light: {
      space: (units: number): string => `${units * 4}px`,
      brandColor: '#a5e',
      color: '#222',
      background: '#e3e3e3'
    }
  },
  variants: [ 'dark', 'light' ] as const, // `as const` is for Typescript only
  defaultVariant: 'dark' as const // `as const` is for Typescript only
});

export {
  createGlobalStyle,
  createLocalTheme,
  GlobalThemeProvider,
  useTheme
};
```

The global theme can be an arbitrary object. The `defaultVariant` is used when
the application starts.

You will need the values returned, so make sure to export them.

If you use TypeScript, make sure to define `variants` and `defaultVariant` as
`const`, this will allow the library to infer the types of later functions
correctly.

### Add the `GlobalThemeProvider` to your application

In the example above, you can see that `createGlobalTheme` returns a
React component `GlobalThemeProvider`. You need to add this context provider to
your application somewhere high up in the tree. All components using local themes
must be below it.

```tsx
import { GlobalThemeProvider } from './style/globalTheme';

const App: FunctionComponent<AppProps> = function ({
  Component,
  pageProps
}): ReactElement {
  return (
    <GlobalThemeProvider>
      <Component { ...pageProps } />
    </GlobalThemeProvider>
  );
};

export default App;
```

### Create component-level themes

You can now use `createLocalTheme` to create isolated component-level themes.

```tsx
import { globalThemeContext } from './style/globalTheme';

const { from, get } = createLocalTheme(
  ({ globalTheme, variant }) => {
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
);
```

The first parameter is a factory that receives the current global theme and
the name of the current variant and returns the local theme. The local theme can
be an arbitrary object as well, but as a general rule it is best that the values
are all either strings or have a `toString` method.

Note that you can execute logic in the factory and make decisions based on the
`variant`. While only the theme corresponding to the `variant` is passed to the
factory, in some cases, you might want to switch things around.

### Using the local theme

The `createLocalTheme` function returns a function called `from`.
You can use this function to reference the local theme in styled components:

```tsx
import { createLocalTheme } from './style/globalTheme';

const { from } = createLocalTheme(({ globalTheme }) => {/* ... */
})

const Banner = styled.div`
  color: ${ from(theme => theme.color) };
  background-color: ${ from(theme => theme.background) };
  padding: ${ from(theme => theme.padding) };
`;
```

The `from` function receives the local theme as its only argument.

_Note_: The `from` function call **must** be the only value in the interpolation.
It can't be wrapped in another function. This won't work:

```tsx
const Headline = styled.span<{ level: number }>`
  font-size: ${({ level }) => from(theme => theme.size(level))};
`;
```

If you need to use the local theme inside a function, use the `get` function.

### Using component props

The `from` function provides a nice shorthand if you just want to access parts of
the local theme. It can't be used inside a function though. If you need to access
component props, you can use the `get` function returned by `createLocalTheme`.

```tsx
import { createLocalTheme } from './style/globalTheme';

const { get } = createLocalTheme(({ globalTheme }) => {/* ... */
})

const Button = styled.button<{ inverted: boolean }>`
  background-color: ${props => props.inverted ? get(theme => theme.backgroundColor.inverted) : get(theme => theme.backgroundColor.normal)};
  color: ${props => props.inverted ? get(theme => theme.color.inverted) : get(theme => theme.color.normal)};
`;
```

### Switching between variants & `useTheme`

The call to `createGlobalTheme` also returns a hook called `useTheme`.
This hook can be used to obtain information about variants, access the global theme
directly, or switch the current variant.

```tsx
import { useTheme } from './style/globalTheme';

const ThemeSwitch: FunctionComponent = () => {
  const {
    availableVariants,
    variant,
    globalTheme,
    switchVariant
  } = useTheme();

  return (
    <button
      onClick={
        (): void => switchVariant('light')
      }
    >
      Switch theme
    </button>
  );
};
```

### Creating global styles with `createGlobalStyle`

styled-components provides a utility function for inserting global CSS rules
called `createGlobalStyle`. While you can still use this utility unimpeded by
this library, you may want to access the global theme from these global styles.

To achieve this, use the `createGlobalStyle` function returned from
`createGlobalTheme`. You can use the resulting component anywhere in your app,
below the `GlobalThemeProvider`.

```tsx
import { createGlobalStyle, GlobalThemeProvider } from './style/globalTheme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Dosis', sans-serif;
    font-size: ${({ globalTheme }): string => globalTheme.fontSize};
    background-color: ${({ globalTheme }): string => globalTheme.backgroundColor};
    color: ${({ globalTheme }): string => globalTheme.color};
  }
`;

const App: FunctionComponent<AppProps> = function ({
  Component,
  pageProps
}): ReactElement {
  return (
    <GlobalThemeProvider>
      <GlobalStyle />
      <Component { ...pageProps } />
    </GlobalThemeProvider>
  );
};

export default App;
```

## Contributing

Feel free to open an issue or a pull request.

### Running quality assurance

```shell
npx roboter
```
