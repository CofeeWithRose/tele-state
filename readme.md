## 


### Demo

```
import { createTeleState } from 'tele-state'
import React, {useEffect} from 'react'

// 
const { useTeleState } = createTeleState(1)

function A({a}:{a:number}){
	const [count, setCount ] = useTeleState()
	console.log('A----------', count)
    useEffect( () =>{
        setCount(count+1) // Component B will update too.
    }, [] )
	return <button onClick={() => setCount(count+1)}>add {count}</button>
}

function B(){
	const [count ] = useTeleState()
	console.log('B----------', count)
	return <>{count}</>
}

```