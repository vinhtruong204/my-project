import { Button } from "../../../../app/ui/Button";
import { LabeledInput } from "../../base/LabeledInput";
import { BetContainer } from "../BetContainer";
import { CustomLabelInput } from "./CustomLabelInput";
import { InputNumberOfGames } from "./InputNumberOfGames";

const MAX_NUMBER_OF_GAMES = 999999999;

export class AutoBetContainer extends BetContainer {
    private numberOfGames: LabeledInput;

    private autoBetButton: Button;
    private inputNumberOfGames: InputNumberOfGames;

    private onWinLabelInput: CustomLabelInput;

    constructor(x: number, y: number) {
        super(x, y);

        // Input number of games autoplay
        this.inputNumberOfGames = new InputNumberOfGames();
        this.inputNumberOfGames.onTypeRequestValueChange = this.onValueChange.bind(this);

        this.numberOfGames = new LabeledInput(
            0,
            this.selectMines.y + this.selectMines.height + 4,
            350,
            50,
            'Number of Games',
            '',
            this.inputNumberOfGames
        );
        this.numberOfGames.setInputAmountText('0');

        this.autoBetButton = new Button({
            text: 'Start Autoplay',
            width: 300,
            height: 100,
            fontSize: 40,
        });

        this.autoBetButton.anchor.set(0, 0);
        this.autoBetButton.position.set(this.numberOfGames.width / 2, this.numberOfGames.y + this.numberOfGames.height + 4);

        // Input percent on win
        this.onWinLabelInput = new CustomLabelInput(0, 0, 'On Win', '');

        // Hide auto container when start game
        this.visible = false;

        // this.addChild(this.numberOfGames, this.autoBetButton);
        this.addChild(this.numberOfGames, this.onWinLabelInput);
    }

    private onValueChange(value: string) {
        this.inputNumberOfGames.value = Number(value) > MAX_NUMBER_OF_GAMES ? String(MAX_NUMBER_OF_GAMES) : value;
    }
}