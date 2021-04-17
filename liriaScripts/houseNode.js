import Component from "../modules/liria/component"
import DrawablePath from "../modules/liria/drawablePath"
import Input from "../modules/liria/Input"
import Node from "../modules/liria/node"
import Vector2 from "../modules/liria/vector2"

const shadow = "M27.47,26.68c0,2.3-3.41,4.17-7.62,4.17S12.24,29,12.24,26.68s3.41-4.17,7.61-4.17S27.47,24.37,27.47,26.68Zm-13-20.43c-4.21,0-7.62,1.87-7.62,4.17s3.41,4.17,7.62,4.17,7.61-1.87,7.61-4.17S18.67,6.25,14.47,6.25ZM26.58,13.6c-4.2,0-7.61,1.87-7.61,4.17s3.41,4.17,7.61,4.17,7.61-1.86,7.61-4.17S30.79,13.6,26.58,13.6Zm-19,.62C3.41,14.22,0,16.08,0,18.39s3.41,4.17,7.61,4.17,7.62-1.87,7.62-4.17S11.82,14.22,7.61,14.22Z"
const wfw = "M15.94,2.33l4.91,3.11v7H11.51v-7Zm.44,19.74v7h9.33v-7L20.8,19Z"
const wfy = "M8.75,10.79l4.91,3.11v7H4.32v-7Zm14.43,2.43v7h9.33v-7L27.6,10.11Z"
const door = "M17.74,12.45H14.62V7.78h3.12Zm-7.19,3.78H7.43V20.9h3.12Zm18.85-.67H26.29v4.66H29.4ZM22.6,24.4H19.49v4.67H22.6Z"
const wl = "M11.51,12.44,8.4,9.33V2.69l3.11,2.75ZM4.32,13.9,1.21,11.14v6.65L4.32,20.9Zm18.86-.68-3.11-2.75v6.64l3.11,3.11Zm-6.8,8.85-3.11-2.76V26l3.11,3.11Z"
const t = "M11.51,5.44,8.4,2.69,12.29,0l3.65,2.33ZM8.75,10.79,5.1,8.46,1.21,11.14,4.32,13.9Zm18.85-.68L24,7.78l-3.89,2.69,3.11,2.75ZM20.8,19l-3.65-2.34-3.88,2.69,3.11,2.76Z"

export default class HouseNode extends Node {
    init() {
        this.addComponent(new DrawablePath([
            {
                path: shadow,
                fill: "#00000033"
            }, {
                path: wfw,
                fill: "#ffe4e7"
            }, {
                path: wfy,
                fill: "#fff600"
            },{
                path: door,
                fill: "#F8453B"
            }, {
                path: wl,
                fill: "#F8453B"
            }, {
                path: t,
                fill: "#BD3925"
            }
        ], "houseGroup", {
            width: 35,
            height: 31,
            scale: 1,
            quality: 3
        }))
    }
}

class FollowMouse extends Component {
    update() {
        const nextPos = this.liria.screenToWorldPos(Input.mousePosition)
        this.transform.position = nextPos
    }
}
