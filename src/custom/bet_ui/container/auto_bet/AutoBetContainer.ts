import { Button } from "../../../../app/ui/Button";
import { LabeledInput } from "../../base/LabeledInput";
import { BetContainer } from "../BetContainer";
import { CustomLabelInput } from "./CustomLabelInput";
import { InputNumberOfGames } from "./InputNumberOfGames";
import { CustomInputStopAuto } from "./CustomInputStopAuto";
import { InputBetAmount } from "../../bet_amount/InputBetAmount";
import { GameStateManager } from "../../../_game/manage_game_states/GameStateManager";
import { GameState } from "../../../_game/manage_game_states/GameState";
import { globalEmitter } from "../../../events/GlobalEmitter";
import { GameStateEvent } from "../../../events/game_states/GameStateEvent";
import { AutoBettingEvent } from "../../../events/auto_betting_events/AutoBettingEvent";
import { WinContainerEvent } from "../../../events/WinContainerEvent";

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

    private startAutobet: Button;
    private profitMultiplierPerTime: number = 0;

    constructor(x: number, y: number) {
        super(x, y);

        globalEmitter.on(GameStateEvent.STATE_CHANGE, this.onGameStateChange.bind(this));

        // Register win listener when auto betting
        globalEmitter.on(AutoBettingEvent.ON_WIN, this.onAutoBetWin.bind(this));

        // Only allow start auto
        globalEmitter.on(AutoBettingEvent.PRESSED_ITEM, this.onItemPressed.bind(this));

        // Input number of games Autobet
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
        this.startAutobet = new Button({
            text: "Start Autobet",
            width: defaultButtonSize.width,
            height: defaultButtonSize.height,
            fontSize: 40,
        });

        this.startAutobet.alpha = 0.5;
        this.startAutobet.interactive = false;
        this.startAutobet.anchor.set(0.5, 0.5);
        this.startAutobet.position.set(this.labelLoss.width / 2, this.labelLoss.y + this.labelLoss.height + 50);
        this.startAutobet.onPress.connect(this.onStartAutobet.bind(this));

        this.addChild(this.numberOfGames, this.onWinLabelInput, this.onLoseLabelInput, this.labelNetGain, this.labelLoss, this.startAutobet);
    }

    private onItemPressed(buttonPressedCount: number) {
        if (buttonPressedCount <= 0) {
            this.startAutobet.interactive = false;
            this.startAutobet.alpha = 0.5;
        } else {
            this.startAutobet.alpha = 1;
            this.startAutobet.interactive = true;
        }
    }

    private onValueChange(value: string) {
        this.inputNumberOfGames.value = Number(value) > MAX_NUMBER_OF_GAMES ? String(MAX_NUMBER_OF_GAMES) : value;
    }

    private onStartAutobet() {
        if (this.startAutobet.text === 'Start Autobet') {
            GameStateManager.getInstance().setState(GameState.BETTING);
            globalEmitter.emit(GameStateEvent.STATE_CHANGE,
                GameState.BETTING,
                this.selectMines.value + 1,
                Number(this.numberOfGames.getInputAmount().value));

            this.profitMultiplierPerTime = (this.selectMines.value + 1) / 10;
        }
        else {
            GameStateManager.getInstance().setState(GameState.NOT_BETTING);
            globalEmitter.emit(WinContainerEvent.DIASABLE);
        }
    }

    private onGameStateChange(state: GameState) {
        if (state === GameState.BETTING) {
            this.startAutobet.text = 'Stop Autobet';
        }
        else if (state === GameState.NOT_BETTING) {

            this.startAutobet.text = 'Start Autobet';
        }
    }

    private onAutoBetWin(diamondCount: number) {
        let profitMultiplier = 1 + diamondCount * this.profitMultiplierPerTime;
        let totalProfit = Number(this.betAmount.getInputAmount().value) * profitMultiplier;

        // Enable win container 
        globalEmitter.emit(WinContainerEvent.ENABLE, profitMultiplier, totalProfit);
    }
}