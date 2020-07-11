import { useState, useMemo, useRef, Reducer, SetStateAction, ReducerState, ReducerAction, Dispatch, useEffect } from 'react'
import {  SharedStateInterface, SharedState, UpdatePlugin } from './shared.state'

let stateId = 0

const useShared = <R extends Reducer<any, any>>( 
  sharedState: SharedStateInterface<ReducerState<R>, ReducerAction<R>> 
  ) => {
  const [ _, setState ]= useState<ReducerState<R>>(sharedState.value)
  const idRef = useRef(useMemo(() => stateId++, []))
  sharedState.setStateMap[idRef.current] = setState
  useEffect(() => () =>{delete sharedState.setStateMap[idRef.current]} ,[])
  const result:[ReducerState<R>, Dispatch<ReducerAction<R>>] =  [ sharedState.value, sharedState.dispatch ]
  return result
}


const createSharedReducer = <R extends Reducer<any, any>>(
  reducer: R,
  initState: ReducerState<R>, 
) => {
  const sharedState: SharedStateInterface<ReducerState<R>, ReducerAction<R>> = 
  new SharedState<ReducerState<R>, ReducerAction<R>>(initState, reducer)
  return {
    useSharedReducer: () => useShared<R>(sharedState),
    reset: () => sharedState.setState(initState),
    apply: (plugin: UpdatePlugin<ReducerState<R>>) => sharedState.apply(plugin),
    
  }
}


const stateReducer = <S>(preState: S, action: SetStateAction<S>) => {
  if(typeof action === 'function'){
    return (action as (preState: S) => S )(preState)
  }else{
    return action
  }
} 

const createSharedState = <S>(initialState: SetStateAction<S>) => {
  const { useSharedReducer, ...rest } = createSharedReducer<Reducer<S, SetStateAction<S> >>( stateReducer, stateReducer(null, initialState ))
  return {
    useSharedState: useSharedReducer,
    ...rest,
  }
}

export { createSharedReducer, createSharedState }
