
import { Vec2 } from '../Data/Vec2'
import {GLElement} from './GLElement'
export class GlImage extends GLElement  {

    constructor( 
      private updatePosition: () => void,
      initInfo : { imgId: number,  position: Vec2},
     ){
      super()
      this.position = initInfo.position
      this.imgId = initInfo.imgId
    }
  
    setPosition(x: number, y: number){
        this.position.x = x
        this.position.y = y
        this.updatePosition()
    }
    
}