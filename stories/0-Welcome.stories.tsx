import React, { useMemo, useEffect } from 'react';
import { linkTo } from '@storybook/addon-links';
// import { Welcome } from '@storybook/react/demo';
import { createTeleState } from '../lib/index'

const { useTeleState } = createTeleState(1);
// const { useTeleState: useLog, dispatch} = createTeleState<string[][]>([])
// const log = (...logs: any[]) => dispatch(pre => [...pre, logs])
const ComponentA = () => {
  const [ count, setCount ] = useTeleState()
  // useMemo(() =>setCount(7),[] )
  useEffect(() => {
    console.log(`ComponentA useEffect--`, count)
  }, [count])
  console.log('ComponentA render--', count)
 
  return <div>
    <button
      onClick={() => setCount(count+1)}
    >
      ComponentA{count}
    </button>
    <ComponentB count={count}/>
  </div>
}
const ComponentB = ({count:c=1, type="B" }) => {
  const [ count, setCount ] = useTeleState()
  // useMemo(() =>setCount(7),[] )
  console.log(`Component${type} render--`, count)
  useEffect(() => {
    console.log(`Component${type} useEffect--`, count)
  }, [count])
  return <button
    onClick={() => setCount(count+1)}
  >
    Component{type}{count} ...{c}
  </button>
}

const Test = () => {
  return <>
    <ComponentB type="C"/>
    <ComponentA/>
  </>
}


export default {
  title: 'Welcome',
  component: Test,
};

export const ToStorybook = () => <Test />;

ToStorybook.story = {
  name: 'tele State',
};
