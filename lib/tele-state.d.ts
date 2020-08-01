import { SetStateAction, Dispatch } from "react";
export declare type UpdatePlugin<S> = (newState: S, preState: S) => void;
export interface TeleStateInterface<S, A> {
    value: S;
    dispatch: Dispatch<A>;
    readonly setStateMap: {
        [id: number]: Dispatch<SetStateAction<S>>;
    };
    setState: (initValue: S) => void;
    apply: (plugin: UpdatePlugin<S>) => void;
}
export declare class TeleState<S, A> implements TeleStateInterface<S, A> {
    value: S;
    reducer: (s: S, a: A) => S;
    constructor(value: S, reducer: (s: S, a: A) => S);
    readonly setStateMap: {
        [id: number]: Dispatch<SetStateAction<S>>;
    };
    updatePlugins: UpdatePlugin<S>[];
    dispatch: (action: A) => void;
    setState: (value: S) => void;
    apply: (plugin: UpdatePlugin<S>) => void;
    protected handleUpdate(pre: S, newS: S): Promise<void>;
    protected handlePlugin(pre: S, newS: S): void;
}
