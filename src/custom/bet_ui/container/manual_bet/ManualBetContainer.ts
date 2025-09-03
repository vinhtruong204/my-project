import { GlobalConfig } from "../../../../app/config/GlobalConfig";
import { Button } from "../../../../app/ui/Button";
import { BetContainer } from "../BetContainer";
import { ManualBettingContainer } from "./ManualBettingContainer";

export class ManualBetContainer extends BetContainer {

    private manualBettingContainer: ManualBettingContainer;

    private betButton: Button;

    constructor(x: number, y: number) {
        super(x, y);

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
        this.updateUI(false);
    }

    private onBettingCompleted() {
        this.updateUI(true);
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