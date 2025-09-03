import { Select } from "@pixi/ui";
import { Sprite, Text } from "pixi.js";

const items: string[] = [
    "1", "2", "3", "4", "5",
    "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15",
    "16", "17", "18", "19", "20",
    "21", "22", "23", "24",
];

const defaultSizeSelectSprite = { width: 500, height: 70 };

function makeBGSprite(path: string): Sprite {
    const s = Sprite.from(path);
    s.width = defaultSizeSelectSprite.width;
    s.height = defaultSizeSelectSprite.height;
    return s;
}

export class SelectMines extends Select {
    private leftLabel: Text;
    // private mineCount: number = 1;

    constructor(x: number, y: number) {
        super({
            closedBG: makeBGSprite('select.png'),
            openBG: makeBGSprite('select.png'),
            textStyle: { fill: 0x000000, fontSize: 36, align: 'left' },
            items: {
                items: items,
                backgroundColor: 0xffffff,
                hoverColor: 0xffffff,
                width: 500,
                height: 50,
            },
            scrollBox: {
                width: 500,
                height: 345,
                radius: 25,
            },
        });

        // Change z index to bring to front 
        this.zIndex = 10;

        this.leftLabel = new Text({
            text: 'Mines',
            style: {
                fontFamily: 'Arial',
                fontSize: 40,
                fill: 'white',
                align: 'center'
            },
        });

        this.position.set(x, y + this.leftLabel.height);
        this.leftLabel.position.y = 0 - this.leftLabel.height;

        this.addChild(this.leftLabel);

        this.value = 0;
    }
}