import { GlobalConfig } from "../../../../app/config/GlobalConfig";
import { Button } from "../../../../app/ui/Button";
import { GameState } from "../../../_game/manage_game_states/GameState";
import { GameStateManager } from "../../../_game/manage_game_states/GameStateManager";
import { GameStateEvent } from "../../../events/GameStateEvent";
import { globalEmitter } from "../../../events/GlobalEmitter";
import { BetContainer } from "../BetContainer";
import { ManualBettingContainer } from "./ManualBettingContainer";

export class ManualBetContainer extends BetContainer {

    private manualBettingContainer: ManualBettingContainer;

    private betButton: Button;

    constructor(x: number, y: number) {
        super(x, y);

        // Register callback when user click a mine 
        globalEmitter.on(GameStateEvent.STATE_CHANGE, this.onGameStateChange.bind(this));

        this.manualBettingContainer = new ManualBettingContainer(this.selectMines.x, this.selectMines.y);

        // Add a callback to handle event betting completed
        this.manualBettingContainer.onBettingCompleted = this.onBettingCompleted.bind(this);

        this.betButton = new Button({
            text: 'Bet',
            width: 200,
            height: 100,
            fontSize: 40
        });

        this.betButton.position.set(this.selectMines.width / 2, this.selectMines.y + this.selectMines.height + 4);

        // Handle bet event
        this.betButton.onPress.connect(this.onBetButtonClicked.bind(this));

        this.addChild(this.manualBettingContainer, this.betButton);
        // this.addChild(this.manualBettingContainer);
    }

    private onBetButtonClicked() {
        GameStateManager.getInstance().setState(GameState.BETTING);

        // Emit event to generate the board
        globalEmitter.emit(GameStateEvent.STATE_CHANGE, GameState.BETTING, this.selectMines.value + 1);
    }

    private onBettingCompleted() {
        GameStateManager.getInstance().setState(GameState.NOT_BETTING);
    }

    private onGameStateChange(state: GameState) {
        if (state === GameState.NOT_BETTING) this.updateUI(true);
        else this.updateUI(false);
    }

    private updateUI(isBetCompleted: boolean) {
        if (isBetCompleted) {
            this.manualBettingContainer.visible = false;
            // this.manualBettingContainer.setGameConfig(
            //     this.selectMines.value + 1,
            //     GlobalConfig.TOTAL_COLUMNS * GlobalConfig.TOTAL_ROWS - (this.selectMines.value + 1),
            //     Number(this.betAmount.getInputAmount().value),
            // );

            this.selectMines.visible = true;
            this.betButton.visible = true;
        }
        else {
            this.manualBettingContainer.visible = true;
            this.manualBettingContainer.setGameConfig(
                this.selectMines.value + 1,
                GlobalConfig.TOTAL_COLUMNS * GlobalConfig.TOTAL_ROWS - (this.selectMines.value + 1),
                Number(this.betAmount.getInputAmount().value),
            );

            this.selectMines.visible = false;
            this.betButton.visible = false;
        }
    }
}