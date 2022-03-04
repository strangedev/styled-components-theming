import { GlobalThemeContext } from './GlobalThemeContext';
import { CreateLocalTheme, getCreateLocalTheme } from './createLocalTheme';
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
  } {
  const globalThemeContext = React.createContext<GlobalThemeContext<TVariants, TGlobalTheme>>({} as any);
  const createLocalTheme = getCreateLocalTheme(globalThemeContext);

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
    useTheme: (): GlobalThemeContext<TVariants, TGlobalTheme> => useContext(globalThemeContext),
    createLocalTheme
  };
};

export {
  createGlobalTheme
};
