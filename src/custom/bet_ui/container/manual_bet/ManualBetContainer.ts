import { GlobalConfig } from "../../../../app/config/GlobalConfig";
import { Button } from "../../../../app/ui/Button";
import { ItemType } from "../../../_game/board/ItemType";
import { GameState } from "../../../_game/manage_game_states/GameState";
import { GameStateManager } from "../../../_game/manage_game_states/GameStateManager";
import { GameStateEvent } from "../../../events/game_states/GameStateEvent";
import { globalEmitter } from "../../../events/GlobalEmitter";
import { ManualBettingEvent } from "../../../events/manual_betting_events/ManualBettingEvent";
import { WinContainerEvent } from "../../../events/WinContainerEvent";
import { BetContainer } from "../BetContainer";
import { ManualBettingContainer } from "./ManualBettingContainer";

export class ManualBetContainer extends BetContainer {

    private manualBettingContainer: ManualBettingContainer;
    private diamondRemain: number = 0;
    private diamondCollected: number = 0;

    // Increase per time when player press a diamond(depend on number of mines)
    private profitMultiplierPerTime: number = 0;

    private betButton: Button;

    constructor(x: number, y: number) {
        super(x, y);

        // Register callback when user click a mine 
        globalEmitter.on(GameStateEvent.STATE_CHANGE, this.onGameStateChange.bind(this));

        // Register listener to handle item pressed event
        globalEmitter.on(ManualBettingEvent.PRESSED_ITEM, this.onItemPressed.bind(this));

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

        // Emit event to disable win container
        globalEmitter.emit(WinContainerEvent.DIASABLE);

        // Initialize diamond count
        this.diamondRemain = GlobalConfig.TOTAL_COLUMNS * GlobalConfig.TOTAL_ROWS - (this.selectMines.value + 1);
        this.diamondCollected = 0;

        // Initialize profitMultiplier per time
        this.profitMultiplierPerTime = (this.selectMines.value + 1) / 10;
    }

    private onBettingCompleted() {
        GameStateManager.getInstance().setState(GameState.NOT_BETTING);

        // Enable win container
        globalEmitter.emit(WinContainerEvent.ENABLE, this.getProfitMultipler(), this.getTotalProfit());
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

    private onItemPressed(itemType: ItemType) {
        if (itemType === ItemType.DIAMOND) {
            this.diamondCollected++;

            this.manualBettingContainer.setGameConfig(null, --this.diamondRemain, this.getTotalProfit(), this.getProfitMultipler());
        } else if (itemType === ItemType.MINE) {
            this.manualBettingContainer.setGameConfig(null, this.diamondRemain, 0);
        }
    }

    private getTotalProfit(): number {
        let profitMultiplier = this.getProfitMultipler();
        return Number(this.betAmount.getInputAmount().value) * profitMultiplier;
    }

    private getProfitMultipler(): number {
        return 1 + this.diamondCollected * this.profitMultiplierPerTime;
    }
}