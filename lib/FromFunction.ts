import { ContextDependentFuture } from './ContextDependentFuture';
import { Getter } from './Getter';

type FromFunction<TLocalTheme> = (getter: Getter<TLocalTheme>) => ContextDependentFuture;

export type {
  FromFunction
};
