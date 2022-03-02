import { getGlobalThemeContext, GlobalThemeContext } from './GlobalThemeContext';
import React, { Context, FunctionComponent, useContext } from 'react';

const createGlobalThemeProvider = function <TVariants extends string, TGlobalTheme> ({
  themes,
  defaultVariant
}: {
  themes: Record<TVariants, TGlobalTheme>;
  variants: TVariants[];
  defaultVariant: TVariants;
}): {
    GlobalThemeProvider: FunctionComponent;
    globalTheme: Context<GlobalThemeContext<TVariants, TGlobalTheme>>;
    useTheme: () => GlobalThemeContext<TVariants, TGlobalTheme>;
  } {
  const context = getGlobalThemeContext({ themes, defaultVariant });
  const initialValue = {
    theme: themes[defaultVariant],
    variant: defaultVariant,
    availableVariants: Object.keys(themes) as TVariants[],
    switchVariant (variant: TVariants): void {
      initialValue.theme = themes[variant];
      initialValue.variant = variant;
    }
  };

  const GlobalThemeProvider: FunctionComponent = ({ children }) => (
    <context.Provider value={ initialValue }>
      { children }
    </context.Provider>
  );

  return {
    GlobalThemeProvider,
    globalTheme: context,
    useTheme: (): GlobalThemeContext<TVariants, TGlobalTheme> => useContext(context)
  };
};

export {
  createGlobalThemeProvider
};
