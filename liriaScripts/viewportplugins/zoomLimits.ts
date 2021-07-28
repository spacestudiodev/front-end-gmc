import {Plugin, Viewport} from "pixi-viewport";

export interface IZoomLimitsOptions {
    minZoom: number,
    maxZoom: number,
};

const DEFAULT_ZOOMLIMITS_OPTIONS: Required<IZoomLimitsOptions> = {
    minZoom: 0.4,
    maxZoom: 1,
};

export default class ZoomLimits extends Plugin {
    public readonly options: Required<IZoomLimitsOptions>;

    constructor(parent: Viewport, options: Partial<IZoomLimitsOptions> = {}) {
        super(parent)
        this.options = Object.assign({}, DEFAULT_ZOOMLIMITS_OPTIONS, options)
        this.parent.on("zoomed", () => {
            if (this.parent.scale.x < this.options.minZoom) {
                this.parent.scale.x = this.parent.scale.y = this.options.minZoom
                this.parent.x = this.parent.lastViewport.x
                this.parent.y = this.parent.lastViewport.y
            }

            if (this.parent.scale.x > this.options.maxZoom) {
                this.parent.scale.x = this.parent.scale.y = this.options.maxZoom
                this.parent.x = this.parent.lastViewport.x
                this.parent.y = this.parent.lastViewport.y
            }
        })
    }
}
