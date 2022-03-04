import { GlobalThemeContext } from './GlobalThemeContext';
import React, { Context, FunctionComponent, useContext, useState } from 'react';

const createGlobalThemeProvider = function <TVariants extends string, TGlobalTheme> ({
  globalThemes,
  defaultVariant
}: {
  globalThemes: Record<TVariants, TGlobalTheme>;
  variants: readonly TVariants[];
  defaultVariant: TVariants;
}): {
    GlobalThemeProvider: FunctionComponent;
    globalThemeContext: Context<GlobalThemeContext<TVariants, TGlobalTheme>>;
    useTheme: () => GlobalThemeContext<TVariants, TGlobalTheme>;
  } {
  const globalThemeContext = React.createContext<GlobalThemeContext<TVariants, TGlobalTheme>>({} as any);

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
    globalThemeContext,
    useTheme: (): GlobalThemeContext<TVariants, TGlobalTheme> => useContext(globalThemeContext)
  };
};

export {
  createGlobalThemeProvider
};
