import { GlobalThemeContext } from './GlobalThemeContext';
import { CreateGlobalStyle, getCreateGlobalStyle } from './getCreateGlobalStyle';
import { CreateLocalTheme, getCreateLocalTheme } from './getCreateLocalTheme';
import React, { FunctionComponent, useContext, useState } from 'react';

const createGlobalTheme = function <TVariants extends string, TGlobalTheme> ({
  globalThemes,
  defaultVariant
}: {
  globalThemes: Record<TVariants, TGlobalTheme>;
  variants: readonly TVariants[];
  defaultVariant: TVariants;
}): {
    GlobalThemeProvider: FunctionComponent;
    useTheme: () => GlobalThemeContext<TVariants, TGlobalTheme>;
    createLocalTheme: CreateLocalTheme<TVariants, TGlobalTheme>;
    createGlobalStyle: CreateGlobalStyle<TGlobalTheme>;
  } {
  const globalThemeContext = React.createContext<GlobalThemeContext<TVariants, TGlobalTheme>>({} as any);
  const createLocalTheme = getCreateLocalTheme(globalThemeContext);
  const useTheme = (): GlobalThemeContext<TVariants, TGlobalTheme> => useContext(globalThemeContext);
  const createGlobalStyle = getCreateGlobalStyle(useTheme);

  const GlobalThemeProvider: FunctionComponent = ({ children }) => {
    const [ value, setValue ] = useState<GlobalThemeContext<TVariants, TGlobalTheme>>({
      globalTheme: globalThemes[defaultVariant],
      variant: defaultVariant,
      availableVariants: Object.keys(globalThemes) as TVariants[],
      switchVariant (variant: TVariants): void {
        setValue({
          ...value,
          globalTheme: globalThemes[variant],
          variant
        });
      }
    });

    return (

      <globalThemeContext.Provider value={ value }>
        { children }
      </globalThemeContext.Provider>
    );
  };

  return {
    GlobalThemeProvider,
    useTheme,
    createLocalTheme,
    createGlobalStyle
  };
};

export {
  createGlobalTheme
};
