# [2.0.0](https://github.com/strangedev/styled-components-theming/compare/1.1.0...2.0.0) (2022-03-04)


### Bug Fixes

* breaking release ([11dca4e](https://github.com/strangedev/styled-components-theming/commit/11dca4e7bea9be8f50df4ad871bcf4076785b8e2))


### BREAKING CHANGES

* To better distinguish between global and component level themes which were previously both called `theme`, the theme obtained by `useTheme` and passed to the `factory` parameter of `createLocalTheme` is now called `globalTheme`.
* Since `createGlobalThemeProvider` returns more than just a context provider and to harmonize the naming with `createLocalTheme`, `createGlobalThemeProvider` was renamed to `createGlobalTheme`.
* The themes parameters of `createGlobalTheme` was renamed to `globalThemes`.

# [1.1.0](https://github.com/strangedev/styled-components-theming/compare/1.0.1...1.1.0) (2022-03-04)


### Features

* release ([4897f77](https://github.com/strangedev/styled-components-theming/commit/4897f7754e05034acd1a2bae8f5422613f6298e6))

## [1.0.1](https://github.com/strangedev/styled-components-theming/compare/1.0.0...1.0.1) (2022-03-04)


### Bug Fixes

* harmonize API ([#3](https://github.com/strangedev/styled-components-theming/issues/3)) ([fa82c00](https://github.com/strangedev/styled-components-theming/commit/fa82c00cd7616dcebf724d8e8496df21758aa10f))

# 1.0.0 (2022-03-03)


### Features

* initial version, needs tests ([e7decd9](https://github.com/strangedev/styled-components-theming/commit/e7decd95febc2ce15c26b38f7b2de21fe30b227b))
