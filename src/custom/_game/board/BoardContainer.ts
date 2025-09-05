import { Container, Sprite } from "pixi.js";
import { GlobalConfig } from "../../../app/config/GlobalConfig";
import { Button } from "../../../app/ui/Button";
import { engine } from "../../../app/getEngine";
import { ItemType } from "./ItemType";
import { GetItem } from "../get_data/GetItem";
import { GameStateManager } from "../manage_game_states/GameStateManager";

export class BoardContainer extends Container {
    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.initBoard();
    }

    private initBoard() {
        const rows = GlobalConfig.TOTAL_ROWS;
        const columns = GlobalConfig.TOTAL_COLUMNS;

        // const buttonWidth = window.innerWidth / columns;
        // const buttonHeight = window.innerHeight / rows;

        const buttonWidth = engine().screen.width / columns;
        const buttonHeight = (engine().screen.height * 0.95) / rows;
        const buttonSize = Math.min(buttonWidth, buttonHeight);

        // console.log(window.innerWidth, window.innerHeight);

        for (let i = 0; i < rows; i++) {
            const columnContainer = new Container({ x: i * buttonSize, y: 0 });
            for (let j = 0; j < columns; j++) {
                const button = new Button({ width: buttonSize, height: buttonSize });

                // Set position of the button
                button.y = j * buttonSize;
                button.onPress.connect(() => this.onPress(button, i, j));

                columnContainer.addChild(button);
            }

            this.addChild(columnContainer);
        }
    }

    private async onPress(btn: Button, i: number, j: number) {
        if (!GameStateManager.getInstance().isBetting()) return;
        if (btn.pressed) return;

        let sprite = new Sprite();

        if (await GetItem.getItemType(i, j) === ItemType.DIAMOND)
            sprite = Sprite.from('diamond.png');
        else
            sprite = Sprite.from('bomb.png');

        sprite.setSize(btn.width, btn.height);
        btn.defaultView = sprite;
        btn.pressed = true;
    }
}