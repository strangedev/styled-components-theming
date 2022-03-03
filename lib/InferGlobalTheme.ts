import { Context } from 'react';
import { GlobalThemeContext } from './GlobalThemeContext';

type InferGlobalTheme<TGlobalThemeContext> = TGlobalThemeContext extends Context<GlobalThemeContext<any, infer TGlobalTheme>> ?
  TGlobalTheme : never;

export type {
  InferGlobalTheme
};
