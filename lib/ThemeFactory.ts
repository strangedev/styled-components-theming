interface ThemeFactoryArgs<TVariants, TGlobalTheme> {
  globalTheme: TGlobalTheme;
  variant: TVariants;
}

type ThemeFactory<TLocalTheme, TVariants, TGlobalTheme> =
  (args: ThemeFactoryArgs<TVariants, TGlobalTheme>) => TLocalTheme;

export type {
  ThemeFactory,
  ThemeFactoryArgs
};
