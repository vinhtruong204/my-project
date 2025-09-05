import { Container, Sprite } from "pixi.js";
import { GlobalConfig } from "../../../app/config/GlobalConfig";
import { Button } from "../../../app/ui/Button";
import { engine } from "../../../app/getEngine";
import { ItemType } from "./ItemType";
import { GetItem } from "../get_data/GetItem";
import { GameStateManager } from "../manage_game_states/GameStateManager";
import { globalEmitter } from "../../events/GlobalEmitter";
import { GameStateEvent } from "../../events/GameStateEvent";
import { GameState } from "../manage_game_states/GameState";

export class BoardContainer extends Container {
    private buttonSize: number = 0;
    private buttons: Button[] = [];

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        globalEmitter.on(GameStateEvent.STATE_CHANGE, this.onGameStateChange.bind(this));

        this.initBoard();
    }

    private initBoard() {
        const rows = GlobalConfig.TOTAL_ROWS;
        const columns = GlobalConfig.TOTAL_COLUMNS;

        const buttonWidth = engine().screen.width / columns;
        const buttonHeight = (engine().screen.height * 0.95) / rows;
        this.buttonSize = Math.min(buttonWidth, buttonHeight);

        for (let i = 0; i < rows; i++) {
            const columnContainer = new Container({ x: i * this.buttonSize, y: 0 });
            for (let j = 0; j < columns; j++) {
                const button = new Button({ width: this.buttonSize, height: this.buttonSize });
                button.y = j * this.buttonSize;
                button.onPress.connect(() => this.onPress(button, i, j));

                columnContainer.addChild(button);
                this.buttons.push(button);
            }
            this.addChild(columnContainer);
        }
    }

    private async onPress(btn: Button, i: number, j: number) {
        if (!GameStateManager.getInstance().isBetting()) return;
        if (btn.pressed) return;

        if (await GetItem.getItemType(i, j) === ItemType.DIAMOND)
            btn.defaultView = this.getButtonView("diamond.png");
        else {
            btn.defaultView = this.getButtonView("bomb.png");

            GameStateManager.getInstance().setState(GameState.NOT_BETTING);

            // Update UI
        }

        btn.pressed = true;
    }

    private onGameStateChange(state: GameState, mines: number) {
        if (state === GameState.BETTING) {
            if (mines) {
                // Generate the matrix
                GetItem.generateMatrix(mines);

                // Reset all the buttons
                this.resetAllButtons();
            }
        }
    }

    private resetAllButtons() {
        for (const btn of this.buttons) {
            let sprite = this.getButtonView("button.png");

            btn.pressed = false;
            btn.defaultView = sprite;
        }
    }

    private getButtonView(path: string): Sprite {
        let sprite = Sprite.from(path);
        sprite.setSize(this.buttonSize, this.buttonSize);
        return sprite;
    }
}