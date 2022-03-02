import React from 'react';

interface GlobalThemeContext<TVariants, TGlobalTheme> {
  theme: TGlobalTheme;
  variant: TVariants;
  availableVariants: TVariants[];
  switchVariant: (variant: TVariants) => void;
}

const getGlobalThemeContext = function <TVariants extends string, TGlobalTheme> ({
  themes,
  defaultVariant
}: {
  themes: Record<TVariants, TGlobalTheme>;
  defaultVariant: TVariants;
}): React.Context<GlobalThemeContext<TVariants, TGlobalTheme>> {
  const state = {
    theme: themes[defaultVariant],
    variant: defaultVariant,
    availableVariants: Object.keys(themes) as TVariants[],
    switchVariant (variant: TVariants): void {
      state.theme = themes[variant];
      state.variant = variant;
    }
  };

  return React.createContext<GlobalThemeContext<TVariants, TGlobalTheme>>(state);
};

export {
  getGlobalThemeContext
};
export type {
  GlobalThemeContext
};
