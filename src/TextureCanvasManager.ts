export class TextureCanvasManager {

    canvas: HTMLCanvasElement
  
    private curLineWidth = 0;
  
    private curLineHeight = 0;

    private ctx: CanvasRenderingContext2D
  
    private id = 0;
  
    constructor(){
      this.canvas = document.createElement('canvas')
      this.canvas.width = 1024
      this.canvas.height = 1024
      this.ctx = this.canvas.getContext('2d')
      this.ctx.fillStyle='red'
      this.ctx.fillRect(0,0, 1024,1024)
    }
  
    setImages(canvasList: HTMLCanvasElement[]): number[]{
      
      const idList = []
  
      for( let i =0; i< canvasList.length; i++ ){
        this.ctx.drawImage(canvasList[i], 0 , 0)
      }
      return idList
    }

    getImageInfos(imgIds: number[]): {x: number, y: number, w: number, h: number}[] {
      return [{x: 0, y: 0, w: 100, h: 100}]
    }
  
  }