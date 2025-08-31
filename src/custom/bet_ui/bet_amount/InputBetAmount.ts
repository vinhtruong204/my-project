import { Graphics } from "pixi.js";
import { CustomInput } from "../base/CustomInput";
import { TriangleType } from "../base/TriangleSprite";

export class InputBetAmount extends CustomInput {
    private betCofig: number[];
    private currentIndex: number = 0;

    constructor() {
        const inputGraphics = new Graphics()
            .rect(0, 0, 500, 50)
            .fill({ color: 'white', alpha: 1 })
            .stroke({ width: 4, color: 'gray', alpha: 1, alignment: 0.5 });

        super(inputGraphics, "0000.00");

        this.betCofig = [200, 400, 600, 800, 1000, 2000, 5000, 7500, 10000];
        this.updateValue();

        // Handle change event
        this.onRequestValueChange = this.handleValueChange.bind(this);
    }

    private handleValueChange(triangleType: TriangleType) {
        if (triangleType === TriangleType.UP)
            this.currentIndex = this.currentIndex + 1 >= this.betCofig.length
                ? this.betCofig.length - 1
                : ++this.currentIndex;
        else
            this.currentIndex = this.currentIndex - 1 < 0 ? 0 : --this.currentIndex;
        this.updateValue();
    }

    private updateValue() {
        this.value = String(this.betCofig[this.currentIndex]);
    }
}