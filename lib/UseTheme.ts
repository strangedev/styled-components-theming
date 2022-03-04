import { GlobalThemeContext } from './GlobalThemeContext';

type UseTheme<TVariants, TGlobalTheme> = () => GlobalThemeContext<TVariants, TGlobalTheme>;

export type {
  UseTheme
};
