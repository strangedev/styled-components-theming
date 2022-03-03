import { getGlobalThemeContext, GlobalThemeContext } from './GlobalThemeContext';
import React, { Context, FunctionComponent, useContext, useState } from 'react';

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

  const GlobalThemeProvider: FunctionComponent = ({ children }) => {
    const [ value, setValue ] = useState<GlobalThemeContext<TVariants, TGlobalTheme>>({
      theme: themes[defaultVariant],
      variant: defaultVariant,
      availableVariants: Object.keys(themes) as TVariants[],
      switchVariant (variant: TVariants): void {
        setValue({
          ...value,
          theme: themes[variant],
          variant
        });
      }
    });

    return (

      <context.Provider value={ value }>
        { children }
      </context.Provider>
    );
  };

  return {
    GlobalThemeProvider,
    globalTheme: context,
    useTheme: (): GlobalThemeContext<TVariants, TGlobalTheme> => useContext(context)
  };
};

export {
  createGlobalThemeProvider
};
