import { Button } from "../../../app/ui/Button";
import { BetContainer } from "./BetContainer";

export class ManualBetContainer extends BetContainer {
    private betButton: Button;

    constructor(x: number, y: number) {
        super(x, y);

        this.betButton = new Button({
            text: 'Bet',
            width: 200,
            height: 100,
            fontSize: 40
        });

        this.betButton.position.set(this.selectMines.width / 2, this.selectMines.y + this.selectMines.height + 4);

        this.addChild(this.betButton);
    }
}