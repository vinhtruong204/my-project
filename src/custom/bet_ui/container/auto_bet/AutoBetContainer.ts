import { Button } from "../../../../app/ui/Button";
import { LabeledInput } from "../../base/LabeledInput";
import { BetContainer } from "../BetContainer";
import { CustomLabelInput } from "./CustomLabelInput";
import { InputNumberOfGames } from "./InputNumberOfGames";
import { CustomInputStopAuto } from "./CustomInputStopAuto";
import { InputBetAmount } from "../../bet_amount/InputBetAmount";
import { GameStateManager } from "../../../_game/manage_game_states/GameStateManager";
import { GameState } from "../../../_game/manage_game_states/GameState";

const MAX_NUMBER_OF_GAMES = 999999999;

const defaultButtonSize = {
    width: 290,
    height: 90
}

export class AutoBetContainer extends BetContainer {
    private numberOfGames: LabeledInput;
    private inputNumberOfGames: InputNumberOfGames;

    private onWinLabelInput: CustomLabelInput;
    private onLoseLabelInput: CustomLabelInput;

    private labelNetGain: LabeledInput;
    private labelLoss: LabeledInput;

    private startAutoplay: Button;

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

        // Input percent on win and loss
        this.onWinLabelInput = new CustomLabelInput(this.numberOfGames.x, this.numberOfGames.y + this.numberOfGames.height, 'On Win (%)', '');
        this.onLoseLabelInput = new CustomLabelInput(this.onWinLabelInput.x, this.onWinLabelInput.y + this.onWinLabelInput.height, 'On Loss (%)', '');

        // Label stop on gain or loss
        let betConfig = (this.betAmount.getInputAmount() as InputBetAmount).getBetConfig();
        this.labelNetGain = new LabeledInput(this.onLoseLabelInput.x, this.onLoseLabelInput.y + this.onLoseLabelInput.height, 500, 30, 'Stop on Net Gain', '', new CustomInputStopAuto(betConfig));
        this.labelLoss = new LabeledInput(this.labelNetGain.x, this.labelNetGain.y + this.labelNetGain.height, 500, 30, 'Stop on Loss', '', new CustomInputStopAuto(betConfig));

        // Hide auto container when start game
        this.visible = false;

        // 
        this.startAutoplay = new Button({
            text: "Start Autoplay",
            width: defaultButtonSize.width,
            height: defaultButtonSize.height,
            fontSize: 40
        });
        this.startAutoplay.anchor.set(0.5, 0.5);
        this.startAutoplay.position.set(this.labelLoss.width / 2, this.labelLoss.y + this.labelLoss.height + 50);
        this.startAutoplay.onPress.connect(this.onStartAutoplay.bind(this));

        this.addChild(this.numberOfGames, this.onWinLabelInput, this.onLoseLabelInput, this.labelNetGain, this.labelLoss, this.startAutoplay);
    }

    private onValueChange(value: string) {
        this.inputNumberOfGames.value = Number(value) > MAX_NUMBER_OF_GAMES ? String(MAX_NUMBER_OF_GAMES) : value;
    }

    private onStartAutoplay() {
        if (this.startAutoplay.text === 'Start Autoplay') {
            GameStateManager.getInstance().setState(GameState.BETTING);
            this.startAutoplay.text = 'Stop Autoplay';
        }
        else {
            GameStateManager.getInstance().setState(GameState.NOT_BETTING);
            this.startAutoplay.text = 'Start Autoplay';
        }
    }

}