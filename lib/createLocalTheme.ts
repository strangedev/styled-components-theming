import { ContextDependentFuture } from './ContextDependentFuture';
import { FromFunction } from './FromFunction';
import { GetFunction } from './GetFunction';
import { Getter } from './Getter';
import { GlobalThemeContext } from './GlobalThemeContext';
import { ThemeFactory } from './ThemeFactory';
import { Context, useContext } from 'react';

type CreateLocalTheme<TVariants, TGlobalTheme> = <TLocalTheme> (factory: ThemeFactory<TLocalTheme, TVariants, TGlobalTheme>) => {
  from: FromFunction<TLocalTheme>;
  get: GetFunction<TLocalTheme>;
};

const getCreateLocalTheme = function <TVariants, TGlobalTheme> (globalThemeContext: Context<GlobalThemeContext<TVariants, TGlobalTheme>>): CreateLocalTheme<TVariants, TGlobalTheme> {
  return function <TLocalTheme> (factory: ThemeFactory<TLocalTheme, TVariants, TGlobalTheme>): {
    from: FromFunction<TLocalTheme>;
    get: GetFunction<TLocalTheme>;
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

    const get = (getter: Getter<TLocalTheme>): string => `${getter(getLocalTheme())}`;
    const from = (getter: Getter<TLocalTheme>): ContextDependentFuture => (): string => get(getter);

    return { from, get };
  };
};

export {
  getCreateLocalTheme
};
export type {
  CreateLocalTheme
};

