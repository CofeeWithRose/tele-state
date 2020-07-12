import { useState, useMemo, useRef, Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch, useEffect, useCallback } from 'react'
import {  TeleStateInterface, TeleState, UpdatePlugin } from './tele-state'

let stateId = 0

const useTele = <R extends Reducer<any, any>>( 
  teleState: TeleStateInterface<ReducerState<R>, ReducerAction<R>> 
  ) => {
  const [ _, setState ]= useState<ReducerState<R>>(teleState.value)
  const idRef = useRef(useMemo(() => stateId++, []))
  teleState.setStateMap[idRef.current] = setState
  useEffect(() => () =>{delete teleState.setStateMap[idRef.current]} ,[])
  const result:[ReducerState<R>, Dispatch<ReducerAction<R>>] =  [ teleState.value, teleState.dispatch ]
  return result
}


// type Reducers<R extends Reducer<any,any>> = {[actionName: string]: R}
// type ReducersReducer<RS extends Reducers<any>> =   RS extends Reducers<infer R>? R : never
type ReducersReducer<S> = <P>(s: S, paload: P) => S
type Reducers<S> = { [actionName: string]: ReducersReducer<S> }
type ReducersState<RS extends Reducers<any>> = RS extends  Reducers<infer S>? S: never
type ReducersPalyLoad<RS extends Reducers<any>, T extends keyof RS> = 
 RS[T] extends ReducersReducer<ReducersState<RS>, infer P>? P :
 never
type ReducersAction<RS extends Reducers<any>, T extends keyof RS> = {type: T, payLoad:  ReducersPalyLoad<RS, T>}

export const createTeleReducers = <RS extends Reducers<any>>(reducers: RS, initState: ReducersState<RS> ) =>{

  const reducer = <T extends keyof RS>(preState:ReducersState<RS>, action: ReducersAction<RS, T>  ) => {
    
    return reducers[action.type](preState, action.payLoad)
  }
  return createTeleReducer<Reducer<
  ReducersState<RS>,
  ReducersAction<RS, keyof RS>
  >>(reducer, initState)
}

const createTeleReducer = <R extends Reducer<any, any>>(
  reducer: R,
  initState: ReducerState<R>, 
) => {
  
 
  const teleState: TeleStateInterface<ReducerState<R>, ReducerAction<R>> = 
  new TeleState<ReducerState<R>, ReducerAction<R>>(initState, reducer)
  return {
    useTeleReducer: () => useTele<R>(teleState),
    reset: () => teleState.setState(initState),
    apply: teleState.apply,
    
  }
}

const stateReducer = <S>(preState: S, action: SetStateAction<S>) => typeof action === 'function'? (action as (preState: S) => S )(preState) : action

const createTeleState = <S>(initialState: SetStateAction<S>) => {
  const { useTeleReducer, ...rest } = createTeleReducer<Reducer<S, SetStateAction<S> >>( stateReducer, stateReducer(null, initialState ))
  return {
    useTeleState: useTeleReducer,
    ...rest,
  }
}




export { createTeleReducer, createTeleState }

interface RReducers extends Reducers<number> {
  add: (s:number, p: number) => number
  // remove:(s:number) => number
}
const reducers: RReducers = {
  add: (s:number, p: number) => s + a,

}
const { useTeleReducer }= createTeleReducers(reducers, 1)
const [ a, d ] = useTeleReducer()
d({ type: 'add', payLoad: })