import { Button } from "../../../../app/ui/Button";
import { BetContainer } from "../BetContainer";

export class AutoBetContainer extends BetContainer {
    private autoBetButton: Button;

    constructor(x: number, y: number) {
        super(x, y);

        this.autoBetButton = new Button({
            text: 'Start Auto Bet',
            width: 300,
            height: 100,
            fontSize: 40
        });

        this.autoBetButton.position.set(this.selectMines.width / 2, this.selectMines.y + this.selectMines.height + 4);

        // Hide auto container when start game
        this.visible = false;

        this.addChild(this.autoBetButton);
    }
}