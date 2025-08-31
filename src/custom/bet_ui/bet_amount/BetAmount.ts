import { Container, Graphics, Text } from "pixi.js";
import { CustomInput } from "../base/CustomInput";
import { InputBetAmount } from "./InputBetAmount";

//**This class contain input field and label text */
export class BetAmount extends Container {
    private leftLabel: Text;
    private rightLabel: Text;

    private inputAmount: CustomInput;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        leftLabel: string,
        rightLabel: string
    ) {
        super({ x: x, y: y, width: width, height: height });

        // Initial left label
        this.leftLabel = new Text({
            text: leftLabel,
            style: {
                fontFamily: 'Arial',
                fontSize: 40,
                fill: 'white',
                align: 'center'
            },
        });

        this.rightLabel = new Text({
            text: rightLabel,
            style: {
                fontFamily: 'Arial',
                fontSize: 40,
                fill: 'white',
                align: 'center',
            }
        });

        // Input
        this.inputAmount = new InputBetAmount();

        this.adjustPosition();

        this.addChild(this.leftLabel, this.rightLabel, this.inputAmount);
    }

    private adjustPosition() {
        this.inputAmount.position.set(0, this.rightLabel.y + this.rightLabel.height);

        this.rightLabel.position.set(this.inputAmount.width - this.rightLabel.width, 0);
    }
}