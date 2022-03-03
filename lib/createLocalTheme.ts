import { GlobalThemeContext } from './GlobalThemeContext';
import { Stringlike } from '@nhummel/css-in-js';
import { Context, useContext } from 'react';

interface ThemeFactoryArgs<TVariants, TGlobalTheme> {
  theme: TGlobalTheme;
  variant: TVariants;
}

type ThemeFactory<TLocalTheme, TVariants, TGlobalTheme> =
  (args: ThemeFactoryArgs<TVariants, TGlobalTheme>) => TLocalTheme;

type Getter<TLocalTheme> = (theme: TLocalTheme) => Stringlike;
type ContextDependentFuture = () => string;
type GetFunction<TLocalTheme> = (getter: Getter<TLocalTheme>) => ContextDependentFuture;

type InferVariants<TGlobalThemeContext> = TGlobalThemeContext extends Context<GlobalThemeContext<infer TVariants, any>> ?
  TVariants : never;
type InferGlobalTheme<TGlobalThemeContext> = TGlobalThemeContext extends Context<GlobalThemeContext<any, infer TGlobalTheme>> ?
  TGlobalTheme : never;

const createLocalTheme = function <TLocalTheme extends object, TGlobalThemeContext extends Context<GlobalThemeContext<any, any>>> ({
  globalTheme,
  themeFactory
}: {
  globalTheme: TGlobalThemeContext;
  themeFactory: ThemeFactory<TLocalTheme, InferVariants<TGlobalThemeContext>, InferGlobalTheme<TGlobalThemeContext>>;
}): {
    get: GetFunction<TLocalTheme>;
  } {
  let localTheme: TLocalTheme | null = null;
  let renderedForVariant: InferVariants<TGlobalThemeContext> | null = null;

  const getLocalTheme = (): TLocalTheme => {
    const { theme, variant } = useContext(globalTheme);

    if (!localTheme || variant !== renderedForVariant) {
      localTheme = themeFactory({ theme, variant });
      renderedForVariant = variant;
    }

    return localTheme;
  };

  const get = (getter: Getter<TLocalTheme>): ContextDependentFuture =>
    (): string =>
      `${getter(getLocalTheme())}`;

  return { get };
};

export {
  createLocalTheme
};
