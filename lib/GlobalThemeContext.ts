interface GlobalThemeContext<TVariants, TGlobalTheme> {
  globalTheme: TGlobalTheme;
  variant: TVariants;
  availableVariants: TVariants[];
  switchVariant: (variant: TVariants) => void;
}

export type {
  GlobalThemeContext
};
