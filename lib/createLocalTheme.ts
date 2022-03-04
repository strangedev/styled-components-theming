import { ContextDependentFuture } from './ContextDependentFuture';
import { FromFunction } from './FromFunction';
import { Getter } from './Getter';
import { GlobalThemeContext } from './GlobalThemeContext';
import { ThemeFactory } from './ThemeFactory';
import { Context, useContext } from 'react';

type CreateLocalTheme<TVariants, TGlobalTheme> = <TLocalTheme> (factory: ThemeFactory<TLocalTheme, TVariants, TGlobalTheme>) => {
  from: FromFunction<TLocalTheme>;
};

const getCreateLocalTheme = function <TVariants, TGlobalTheme> (globalThemeContext: Context<GlobalThemeContext<TVariants, TGlobalTheme>>): CreateLocalTheme<TVariants, TGlobalTheme> {
  return function <TLocalTheme> (factory: ThemeFactory<TLocalTheme, TVariants, TGlobalTheme>): {
    from: FromFunction<TLocalTheme>;
  } {
    let localTheme: TLocalTheme | null = null;
    let renderedForVariant: TVariants | null = null;

    const getLocalTheme = (): TLocalTheme => {
      const { globalTheme, variant } = useContext(globalThemeContext);

      if (!localTheme || variant !== renderedForVariant) {
        localTheme = factory({ globalTheme, variant });
        renderedForVariant = variant;
      }

      return localTheme;
    };

    const from = (getter: Getter<TLocalTheme>): ContextDependentFuture =>
      (): string =>
        `${getter(getLocalTheme())}`;

    return { from };
  };
};

export {
  getCreateLocalTheme
};
export type {
  CreateLocalTheme
};

