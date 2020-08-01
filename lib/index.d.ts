import { Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch } from 'react';
import { UpdatePlugin } from './tele-state';
export declare const createTeleReducers: <R extends Reducer<any, any>>(reducers: R, initState: ReducerState<R>) => {
    useTeleReducer: () => [ReducerState<R>, Dispatch<ReducerAction<R>>];
    reset: () => void;
    apply: (plugin: UpdatePlugin<ReducerState<R>>) => void;
    dispatch: Dispatch<ReducerAction<R>>;
};
declare const createTeleReducer: <R extends Reducer<any, any>>(reducer: R, initState: ReducerState<R>) => {
    useTeleReducer: () => [ReducerState<R>, Dispatch<ReducerAction<R>>];
    reset: () => void;
    apply: (plugin: UpdatePlugin<ReducerState<R>>) => void;
    dispatch: Dispatch<ReducerAction<R>>;
};
declare const createTeleState: <S>(initialState: SetStateAction<S>) => {
    reset: () => void;
    apply: (plugin: UpdatePlugin<S>) => void;
    dispatch: Dispatch<SetStateAction<S>>;
    useTeleState: () => [S, Dispatch<SetStateAction<S>>];
};
export { createTeleReducer, createTeleState };
