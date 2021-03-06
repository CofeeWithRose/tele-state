import { GlImage } from './GLElement/GLImage';
import { Vec2 } from './Data/Vec2';
import { GLElement } from './GLElement/GLElement';
export declare enum GL_ELEMENT_TYPES {
    GL_IMAGE = "GL_IMAGE"
}
export interface GLElements {
    [GL_ELEMENT_TYPES.GL_IMAGE]: GlImage;
}
export interface GLElementTypes {
    [GL_ELEMENT_TYPES.GL_IMAGE]: typeof GlImage;
}
export interface GLElementParams {
    [GL_ELEMENT_TYPES.GL_IMAGE]: {
        imgId: number;
        position: Vec2;
    };
}
declare const DEFAULT_OPTION: {
    maxNumber: number;
    textureSize: number;
};
export declare class GLRender {
    private textureCanvas;
    private elemetList;
    private GLElemetMap;
    private gl;
    private uniformLocations;
    private attribuitesLocations;
    private attrData;
    private attrBuffer;
    private needSort;
    private positionChanged;
    private imageIdChanged;
    private textureChange;
    private rafing;
    private texture;
    private options;
    constructor(glCanvas: HTMLCanvasElement, options?: Partial<typeof DEFAULT_OPTION>);
    getTexture: () => HTMLCanvasElement;
    private updateImidiatly;
    private checkReloadTexure;
    private initTexture;
    private initBuffer;
    setViewPort(): void;
    createElement<T extends GL_ELEMENT_TYPES>(type: T, params: GLElementParams[T]): GLElements[T];
    private updatePosition;
    destoryElement(ele: GLElement): void;
    loadImgs(imgs: HTMLCanvasElement[]): number[];
    private update;
    private updateSort;
    private updateImage;
}
export {};
