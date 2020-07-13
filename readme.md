## tele-state 

The best way to manage your state with hooks for your react application.

efficiency 、light 、easy to use 、typescript friendly.  try it!


## Demos

```
npm i tele-state
```
### useTeleState
```
import { createTeleState } from 'tele-state'
import React, { useEffect } from 'react'



// create a useTeleState hook, then you can use it as useState.
const { useTeleState } = createTeleState(1)

function ComponentA(){
	const [ count ] = useTeleState()
	console.log('B----------', count)
	return <>{count}</>
}

function ComponentB(){
	const [ count, setCount ] = useTeleState()
	console.log('A----------', count)
	useEffect( () =>{
		setCount(count+1) // ComponentA will update too.
	}, [] )
	return <button onClick={() => setCount(count+1)}>add {count}</button>
}

```

### useTeleReducer
```
import { createTeleReducer } from 'tele-state'
import React, { useEffect, Reducer } from 'react'


/**
 *  the reducer is samilar to useReducer.
 * @param count 
 * @param param1 
 */
const reducer:Reducer<number, {type:'add'}> = (count, {type}) => {
    switch (type) {
        case 'add':
            return count +1
        default :
        return count
    }
}

/**
 * create a useTeleReducer hook with reducer.
 */
const { useTeleReducer } = createTeleReducer(reducer, 1)

function ComponentA(){
	const [ count ] = useTeleReducer()
	console.log('B----------', count)
	return <>{count}</>
}

function ComponentB(){
	const [ count, dispatch ] = useTeleReducer()
	console.log('A----------', count)
	useEffect( () =>{
		dispatch({type:'add'}) // ComponentA will update too.
	}, [] )
	return <button onClick={() => dispatch({type: 'add'})}>add {count}</button>
}

```
