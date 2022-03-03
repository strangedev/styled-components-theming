import { GlobalThemeContext } from './GlobalThemeContext';
import { InferGlobalTheme } from './InferGlobalTheme';
import { InferVariants } from './InferVariants';
import { Stringlike } from '@nhummel/css-in-js';
import { ThemeFactory } from './ThemeFactory';
import { Context, useContext } from 'react';

type Getter<TLocalTheme> = (theme: TLocalTheme) => Stringlike;
type ContextDependentFuture = () => string;
type FromFunction<TLocalTheme> = (getter: Getter<TLocalTheme>) => ContextDependentFuture;

const createLocalTheme = function <TLocalTheme extends object, TGlobalThemeContext extends Context<GlobalThemeContext<any, any>>> ({
  globalThemeContext,
  factory
}: {
  globalThemeContext: TGlobalThemeContext;
  factory: ThemeFactory<TLocalTheme, InferVariants<TGlobalThemeContext>, InferGlobalTheme<TGlobalThemeContext>>;
}): {
    from: FromFunction<TLocalTheme>;
  } {
  let localTheme: TLocalTheme | null = null;
  let renderedForVariant: InferVariants<TGlobalThemeContext> | null = null;

  const getLocalTheme = (): TLocalTheme => {
    const { theme, variant } = useContext(globalThemeContext);

    if (!localTheme || variant !== renderedForVariant) {
      localTheme = factory({ theme, variant });
      renderedForVariant = variant;
    }

    return localTheme;
  };

  const from = (getter: Getter<TLocalTheme>): ContextDependentFuture =>
    (): string =>
      `${getter(getLocalTheme())}`;

  return { from };
};

export {
  createLocalTheme
};
