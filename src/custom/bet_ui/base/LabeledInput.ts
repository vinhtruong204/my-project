import { Container, Text } from "pixi.js";
import { CustomInputBase } from "./CustomInputBase";

//**This class contain input field and label text */
export class LabeledInput extends Container {
    protected leftLabel: Text;
    protected rightLabel: Text;

    protected inputAmount: CustomInputBase;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        leftLabel: string,
        rightLabel: string,
        inputAmount: CustomInputBase
    ) {
        super({ x: x, y: y, width: width, height: height });

        this.inputAmount = inputAmount;

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

        this.adjustPosition();

        this.addChild(this.leftLabel, this.rightLabel, this.inputAmount);
    }

    private adjustPosition() {
        this.inputAmount.position.set(0, this.rightLabel.y + this.rightLabel.height);

        this.rightLabel.position.set(this.inputAmount.width - this.rightLabel.width, 0);
    }

    public getInputAmount(): CustomInputBase {
        return this.inputAmount;
    }

    public setInputAmountText(value: string) {
        this.inputAmount.value = value;
    }
}