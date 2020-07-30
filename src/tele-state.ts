import { SetStateAction, Key, Dispatch } from "react"

export type UpdatePlugin<S> = (newState: S, preState: S) => void

export interface TeleStateInterface<S, A> {
  value: S
  dispatch: Dispatch<A>
  readonly setStateMap: { [id: number]: Dispatch<SetStateAction<S>> }
  setState: (initValue: S) => void
  apply: (plugin: UpdatePlugin<S>) => void
}

export class TeleState<S, A> implements TeleStateInterface<S, A> {
  
  constructor(
     public value: S,
     public reducer: (s:S, a: A) => S 
  ){}

  public readonly setStateMap: { [id: number]: Dispatch<SetStateAction<S>> } = {}

  public updatePlugins: UpdatePlugin<S>[] = []

  dispatch = (action: A ) => {
    const preValue = this.value
    this.value = this.reducer(this.value, action)
    this.handleUpdate(preValue, this.value)
  }

  setState = (value: S) => {
    const preValue = this.value
    this.value = value
    this.handleUpdate(preValue, this.value)
  }

  apply = (plugin: UpdatePlugin<S>) =>{
    this.updatePlugins.push(plugin)
  }

  protected async handleUpdate(pre:S, newS:S){
    this.handlePlugin(pre, newS)
    /**
     * Avoid Cannot update a component from inside the function body of a different component error.
     * https://github.com/facebook/react/issues/18178#issuecomment-595846312
     */
    await Promise.resolve()
    Object.values(this.setStateMap).forEach( setState => setState(newS) )
  }

  protected handlePlugin(pre:S, newS: S){
    
    for(let i = 0; i< this.updatePlugins.length; i++){
      try{
        this.updatePlugins[i](newS, pre)
      }catch(e){
        console.error(e);
      }
    }
  }
}
