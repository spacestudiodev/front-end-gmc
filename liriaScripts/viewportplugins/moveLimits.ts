import { Plugin, Viewport } from "pixi-viewport";

export interface IZoomLimitsOptions {
    left: number,
    right: number,
    top: number,
    bottom: number,
};

const DEFAULT_ZOOMLIMITS_OPTIONS: Required<IZoomLimitsOptions> = {
    top: 100,
    left: 0,
    right: 1000,
    bottom: 1000,
};

export default class MoveLimits extends Plugin {
    public readonly options: Required<IZoomLimitsOptions>;
    
    constructor(parent: Viewport, options: Required<IZoomLimitsOptions> = DEFAULT_ZOOMLIMITS_OPTIONS) {
        super(parent)
        this.options = options
    }

    public update(): void {
        const scale = this.parent.scale.x

        const left = this.options.left
        const right = this.options.right
        const top = this.options.top
        const bottom = this.options.bottom

        const width = this.parent.right - this.parent.left
        const height = this.parent.bottom - this.parent.top

        if(this.parent.left < left) {
            this.parent.x = left * scale * -1
        }

        if(this.parent.right > right) {
            this.parent.x = (right - width) * scale * -1
        }

        if(this.parent.top < top) {
            this.parent.y = top * scale * -1
        }

        if(this.parent.bottom > bottom) {
            this.parent.y = (bottom - height) * scale * -1
        }
    }
}
