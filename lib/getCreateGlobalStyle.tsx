import { Stringlike } from '@nhummel/css-in-js';
import { UseTheme } from './UseTheme';
import { createGlobalStyle, SimpleInterpolation, ThemeProvider } from 'styled-components';
import React, { FunctionComponent, ReactElement } from 'react';

type InterpolationFunction<TGlobalTheme> = (args: { globalTheme: TGlobalTheme }) => Stringlike;
type Interpolation<TGlobalTheme> = InterpolationFunction<TGlobalTheme> | SimpleInterpolation;

type StyledInterpolationFunction<TGlobalTheme> = (args: { theme: TGlobalTheme }) => string;
type StyledInterpolation<TGlobalTheme> = StyledInterpolationFunction<TGlobalTheme> | SimpleInterpolation;

type CreateGlobalStyle <TGlobalTheme> = (strings: TemplateStringsArray, ...interpolations: Interpolation<TGlobalTheme>[]) => FunctionComponent;

const getCreateGlobalStyle = function <TVariants, TGlobalTheme> (useTheme: UseTheme<TVariants, TGlobalTheme>): CreateGlobalStyle<TGlobalTheme> {
  return (strings, ...interpolations): FunctionComponent => {
    const GlobalStyleComponent = createGlobalStyle(
      strings,
      ...interpolations.map(
        (interpolation): StyledInterpolation<any> => {
          if (typeof interpolation !== 'function') {
            return interpolation;
          }

          return ({ theme }): string => `${interpolation({ globalTheme: theme })}`;
        }
      )
    );

    return (): ReactElement => {
      const { globalTheme } = useTheme();

      return (
        <ThemeProvider theme={ globalTheme }>
          <GlobalStyleComponent />
        </ThemeProvider>
      );
    };
  };
};

export {
  getCreateGlobalStyle
};
export type {
  CreateGlobalStyle
};
