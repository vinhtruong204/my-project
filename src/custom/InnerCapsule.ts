import { Container, Graphics } from "pixi.js";
import { Text } from "pixi.js";

export class InnerCapsule extends Container {
    private capsuleWidth = 500;
    private capsuleHeight = 100;
    private cornerRadius = this.capsuleHeight / 2;

    private rectContainer: Graphics;
    private leftChild: Graphics;
    private textManual: Text;


    // private rightChild: Graphics;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        this.rectContainer = new Graphics()
            .roundRect(0, 0, this.capsuleWidth, this.capsuleHeight, this.cornerRadius)
            .fill({ color: 'gray', alpha: 0.75 })
            .stroke({ width: 5, color: 'white', alignment: 0.5 });

        this.leftChild = new Graphics()
            .roundRect(0, 0, this.capsuleWidth / 2, this.capsuleHeight, this.cornerRadius)
            .fill({ color: 'green', alpha: 0.5 })
            .stroke({ width: 5, color: 'white', alignment: 0.5 });

        this.leftChild.eventMode = 'static';
        this.leftChild.cursor = 'pointer';
        this.leftChild.on('pointerdown', () => {
            // To do: Switch manual bet UI

        });

        this.textManual = new Text({
            text: 'Manual',
            style: {
                fontSize: 32,
                fontFamily: "Arial",
                align: 'center',
                fill: '0x000000'
            }
        });
        this.textManual.anchor = 0.5;
        this.textManual.position.set(this.leftChild.width / 2, this.leftChild.height / 2);

        this.leftChild.addChild(this.textManual);


        this.rectContainer.addChild(this.leftChild);
        this.addChild(this.rectContainer);
    }

    


}