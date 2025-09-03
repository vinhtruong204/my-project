import { Graphics } from "pixi.js";
import { CustomInputBase } from "../../base/CustomInputBase";
import { LabeledInput } from "../../base/LabeledInput";
import { Button } from "../../../../app/ui/Button";

const defaultInputFieldSize = {
    width: 500,
    height: 50
}

const defaultButtonSize = {
    width: 50,
    height: 50
}

export class CustomLabelInput extends LabeledInput {
    private resetButton: Button;
    private increaseButton: Button;

    constructor(x: number, y: number, leftLabel: string, rightLabel: string) {
        const inputFieldGraphics = new Graphics()
            .rect(0, 0, defaultInputFieldSize.width, defaultInputFieldSize.height)
            .fill({ color: 'white', alpha: 1 })
            .stroke({ width: 4, color: 'gray', alpha: 1, alignment: 0.5 });

        super(x, y, defaultInputFieldSize.width, defaultInputFieldSize.height, leftLabel, rightLabel, new CustomInputBase(inputFieldGraphics, ''));

        this.resetButton = new Button({
            text: 'Reset',
            width: defaultButtonSize.width,
            height: defaultButtonSize.height,
            fontSize: 40,
        });

        this.increaseButton = new Button({
            text: 'Increase by:',
            width: defaultButtonSize.width,
            height: defaultButtonSize.height,
            fontSize: 40,
        });

        this.addChild(this.resetButton, this.increaseButton);
    }
}