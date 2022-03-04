import { Getter } from './Getter';

type GetFunction<TLocalTheme> = (getter: Getter<TLocalTheme>) => string;

export type {
  GetFunction
};
