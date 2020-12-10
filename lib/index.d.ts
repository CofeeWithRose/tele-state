import { Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch } from 'react';
export declare const createTeleReducers: <R extends Reducer<any, any>>(reducers: R, initState: ReducerState<R>) => {
    useTeleReducer: () => [ReducerState<R>, Dispatch<ReducerAction<R>>];
    reset: () => void;
    apply: (plugin: import("./tele-state").UpdatePlugin<ReducerState<R>>) => void;
    dispatch: Dispatch<ReducerAction<R>>;
};
declare const createTeleReducer: <R extends Reducer<any, any>>(reducer: R, initState: ReducerState<R>) => {
    useTeleReducer: () => [ReducerState<R>, Dispatch<ReducerAction<R>>];
    reset: () => void;
    apply: (plugin: import("./tele-state").UpdatePlugin<ReducerState<R>>) => void;
    dispatch: Dispatch<ReducerAction<R>>;
};
declare const createTeleState: <S>(initialState: SetStateAction<S>) => {
    reset: () => void;
    apply: (plugin: import("./tele-state").UpdatePlugin<S>) => void;
    dispatch: Dispatch<SetStateAction<S>>;
    useTeleState: () => [S, Dispatch<SetStateAction<S>>];
};
export { createTeleReducer, createTeleState };
