import { Stringlike } from '@nhummel/css-in-js';

type Getter<TLocalTheme> = (theme: TLocalTheme) => Stringlike;

export type {
  Getter
};
