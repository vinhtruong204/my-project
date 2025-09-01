import { Container } from "pixi.js"
import { LabeledInput } from "../base/LabeledInput";
import { InputBetAmount } from "../bet_amount/InputBetAmount";
import { SelectMines } from "../mines_ui/SelectMines";
import { Button } from "../../../app/ui/Button";

export class ManualBetContainer extends Container {
    private betAmount: LabeledInput;
    private selectMines: SelectMines;
    private betButton: Button;

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.betAmount = new LabeledInput(0, 0, 200, 100, "Bet Amount", "00.0$",
            new InputBetAmount()
        );

        this.selectMines = new SelectMines(this.betAmount.x, this.betAmount.y + this.betAmount.height);

        this.betButton = new Button({
            text: 'Bet',
            width: 200,
            height: 100,
            fontSize: 40
        });

        this.betButton.position.set(this.selectMines.width / 2, this.selectMines.y + this.selectMines.height + 4);

        this.addChild(this.betAmount, this.selectMines, this.betButton);
    }
}