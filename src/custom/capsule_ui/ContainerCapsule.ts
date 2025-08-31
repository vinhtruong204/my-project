import { Container, Graphics } from "pixi.js";
import { ChildCapsule } from "./ChildCapsule";
import { CapsuleType } from "./CapsuleType";

export class ContainerCapsule extends Container {
    private capsuleWidth = 500;
    private capsuleHeight = 100;
    private cornerRadius = this.capsuleHeight / 2;

    private rectContainer: Graphics;

    private leftChild: ChildCapsule;
    private rightChild: ChildCapsule;

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.width = this.capsuleWidth;
        this.height = this.capsuleHeight;

        this.rectContainer = new Graphics()
            .roundRect(0, 0, this.capsuleWidth, this.capsuleHeight, this.cornerRadius)
            .fill({ color: 'gray', alpha: 0.75 })
            .stroke({ width: 5, color: 'white', alignment: 0.5 });

        // Left child
        this.leftChild = new ChildCapsule(0, 0, this.capsuleWidth / 2, this.capsuleHeight, CapsuleType.MANUAL);

        // Right child
        this.rightChild = new ChildCapsule(
            this.leftChild.x + this.leftChild.width,
            0,
            this.capsuleWidth / 2,
            this.capsuleHeight,
            CapsuleType.AUTO)

        this.addChild(this.rectContainer, this.leftChild, this.rightChild);
    }




}