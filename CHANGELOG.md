# [3.0.0](https://github.com/strangedev/styled-components-theming/compare/2.0.0...3.0.0) (2022-03-04)


### Features

* pass context implicitly to createLocalTheme ([#4](https://github.com/strangedev/styled-components-theming/issues/4)) ([edda026](https://github.com/strangedev/styled-components-theming/commit/edda026c1373599d577284209cd23af715a1e822))


### BREAKING CHANGES

* `createLocalTheme` is not exported anymore and can be
obtained from `createGlobalTheme`.
* `createLocalTheme` only receives the factory now, you
don't need to pass the `globalThemeContext` anymore.
* `createGlobalTheme` does not return the
`globalThemeContext` anymore.

# [2.0.0](https://github.com/strangedev/styled-components-theming/compare/1.1.0...2.0.0) (2022-03-04)


### Bug Fixes

* harmonize API ([#3](https://github.com/strangedev/styled-components-theming/issues/3)) ([fa82c00](https://github.com/strangedev/styled-components-theming/commit/fa82c00cd7616dcebf724d8e8496df21758aa10f))


### BREAKING CHANGES

* To better distinguish between global and component level themes which were previously both called `theme`, the theme obtained by `useTheme` and passed to the `factory` parameter of `createLocalTheme` is now called `globalTheme`.
* Since `createGlobalThemeProvider` returns more than just a context provider and to harmonize the naming with `createLocalTheme`, `createGlobalThemeProvider` was renamed to `createGlobalTheme`.
* The themes parameters of `createGlobalTheme` was renamed to `globalThemes`.


# 1.0.0 (2022-03-03)


### Features

* initial version, needs tests ([e7decd9](https://github.com/strangedev/styled-components-theming/commit/e7decd95febc2ce15c26b38f7b2de21fe30b227b))
