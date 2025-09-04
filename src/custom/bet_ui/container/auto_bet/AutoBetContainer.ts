import { Button } from "../../../../app/ui/Button";
import { LabeledInput } from "../../base/LabeledInput";
import { BetContainer } from "../BetContainer";
import { CustomLabelInput } from "./CustomLabelInput";
import { InputNumberOfGames } from "./InputNumberOfGames";
import { CustomInputStopAuto } from "./CustomInputStopAuto";
import { InputBetAmount } from "../../bet_amount/InputBetAmount";

const MAX_NUMBER_OF_GAMES = 999999999;

export class AutoBetContainer extends BetContainer {
    private numberOfGames: LabeledInput;

    private autoBetButton: Button;
    private inputNumberOfGames: InputNumberOfGames;

    private onWinLabelInput: CustomLabelInput;
    private onLoseLabelInput: CustomLabelInput;

    private labelNetGain: LabeledInput;
    private labelLoss: LabeledInput;

    constructor(x: number, y: number) {
        super(x, y);

        // Input number of games autoplay
        this.inputNumberOfGames = new InputNumberOfGames();
        this.inputNumberOfGames.onTypeRequestValueChange = this.onValueChange.bind(this);

        this.numberOfGames = new LabeledInput(
            0,
            this.selectMines.y + this.selectMines.height,
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

        // Input percent on win and loss
        this.onWinLabelInput = new CustomLabelInput(this.numberOfGames.x, this.numberOfGames.y + this.numberOfGames.height, 'On Win (%)', '');
        this.onLoseLabelInput = new CustomLabelInput(this.onWinLabelInput.x, this.onWinLabelInput.y + this.onWinLabelInput.height, 'On Loss (%)', '');

        // Label stop on gain or loss
        let betConfig = (this.betAmount.getInputAmount() as InputBetAmount).getBetConfig();
        this.labelNetGain = new LabeledInput(this.onLoseLabelInput.x, this.onLoseLabelInput.y + this.onLoseLabelInput.height, 500, 30, 'Stop on Net Gain', '', new CustomInputStopAuto(betConfig));
        this.labelLoss = new LabeledInput(this.labelNetGain.x, this.labelNetGain.y + this.labelNetGain.height, 500, 30, 'Stop on Loss', '', new CustomInputStopAuto(betConfig));

        // Hide auto container when start game
        this.visible = false;

        // this.addChild(this.numberOfGames, this.autoBetButton);
        this.addChild(this.numberOfGames, this.onWinLabelInput, this.onLoseLabelInput, this.labelNetGain, this.labelLoss);
    }

    private onValueChange(value: string) {
        this.inputNumberOfGames.value = Number(value) > MAX_NUMBER_OF_GAMES ? String(MAX_NUMBER_OF_GAMES) : value;
    }
}