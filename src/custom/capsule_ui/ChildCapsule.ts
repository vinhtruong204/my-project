import { Container, Graphics, Text } from "pixi.js";
import { CapsuleType } from "./CapsuleType";

export class ChildCapsule extends Container {
    // private selected: boolean = false;

    // UI
    private capsule: Graphics;
    private textUI: Text;

    // Type of child capsule
    private capsuletype: CapsuleType;

    constructor(x: number, y: number, width: number, height: number, capsuleType: CapsuleType) {
        super({ x: x, y: y, width: width, height: height });

        this.capsuletype = capsuleType;

        this.capsule = new Graphics()
            .roundRect(0, 0, width, height, height / 2)
            .fill({ color: 'green', alpha: 0.5 })
            .stroke({ width: 5, color: 'white', alignment: 0.5 });

        this.textUI = new Text({
            text: this.capsuletype,
            style: {
                fontSize: 32,
                fontFamily: "Arial",
                align: 'center',
                fill: '0x000000'
            }
        });
        this.textUI.anchor = 0.5;
        this.textUI.position.set(width / 2, height / 2);

        this.addChild(this.capsule, this.textUI);

        // Change UI when hover and allow interact
        this.cursor = 'pointer';
        this.eventMode = 'static';

        // Handle event
        this.onpointerdown = this.handleOnDown;
        this.onpointerenter = this.handleOnEnter;
        this.onpointerleave = this.handleOnLeave;
    }

    private handleOnDown() {
        console.log("clicked");
    }
    
    private handleOnEnter() {
        console.log("enter");
    }

    private handleOnLeave() {
        console.log("leave");
    }




}