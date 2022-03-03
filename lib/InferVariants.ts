import { Context } from 'react';
import { GlobalThemeContext } from './GlobalThemeContext';

type InferVariants<TGlobalThemeContext> = TGlobalThemeContext extends Context<GlobalThemeContext<infer TVariants, any>> ?
  TVariants : never;

export type {
  InferVariants
};
