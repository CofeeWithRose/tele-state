import { Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch } from 'react';
import { UpdatePlugin } from './shared.state';
declare const createSharedReducer: <R extends Reducer<any, any>>(reducer: R, initState: ReducerState<R>) => {
    useSharedReducer: () => [ReducerState<R>, Dispatch<ReducerAction<R>>];
    reset: () => void;
    apply: (plugin: UpdatePlugin<ReducerState<R>>) => void;
};
declare const createSharedState: <S>(initialState: SetStateAction<S>) => {
    reset: () => void;
    apply: (plugin: UpdatePlugin<S>) => void;
    useSharedState: () => [S, Dispatch<SetStateAction<S>>];
};
export { createSharedReducer, createSharedState };
