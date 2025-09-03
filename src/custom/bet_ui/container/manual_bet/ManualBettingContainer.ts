import { Container, Graphics } from "pixi.js";
import { CustomInputBase } from "../../base/CustomInputBase";
import { LabeledInput } from "../../base/LabeledInput";
import { Button } from "../../../../app/ui/Button";

const defaultInputFieldSize = {
    width: 350,
    height: 50
}

const defaultButtonSize = {
    width: 50,
    height: 50
}

export class ManualBettingContainer extends Container {
    private minesCount: LabeledInput;
    private diamondRemain: LabeledInput;

    private totalProfit: LabeledInput;

    private randomButton: Button;
    private widthdrawButton: Button;

    public onBettingCompleted?: () => void;

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.minesCount = new LabeledInput(
            0,
            0,
            defaultInputFieldSize.width,
            defaultInputFieldSize.height,
            'Mines',
            '',
            this.getInputCanNotInteract());

        this.diamondRemain = new LabeledInput(
            this.minesCount.x + this.minesCount.width,
            0,
            defaultInputFieldSize.width,
            defaultInputFieldSize.height,
            'Diamond',
            '',
            this.getInputCanNotInteract());

        // this.minesCount.setInputAmountText('8');
        this.totalProfit = new LabeledInput(
            this.minesCount.x,
            this.minesCount.y + this.minesCount.height + 20,
            defaultInputFieldSize.width * 2,
            defaultInputFieldSize.height,
            'Total profit (1.00x)',
            '0.00US$',
            this.getInputCanNotInteract(true));

        // Random button
        this.randomButton = new Button({
            text: 'Choose randomly',
            width: this.totalProfit.width,
            height: this.totalProfit.height,
            fontSize: 40
        });
        this.randomButton.anchor.set(0, 0);
        this.randomButton.position.set(this.totalProfit.x, this.totalProfit.y + this.totalProfit.height + 20);

        // Withdraw button
        this.widthdrawButton = new Button({
            text: 'Withdraw',
            width: this.totalProfit.width,
            height: this.totalProfit.height,
            fontSize: 40
        });
        this.widthdrawButton.anchor.set(0, 0);
        this.widthdrawButton.position.set(this.randomButton.x, this.randomButton.y + this.randomButton.height + 20);
        this.widthdrawButton.onPress.connect(this.handleWithdrawButtonClicked.bind(this));

        this.addChild(this.minesCount, this.diamondRemain, this.totalProfit, this.randomButton, this.widthdrawButton);

        // Disable when the game start
        this.visible = false;
    }

    private getBackgroundOfInput(isFullWidth: boolean) {
        const width = isFullWidth ? defaultInputFieldSize.width + defaultButtonSize.width * 3 : defaultInputFieldSize.width - defaultButtonSize.width * 2;
        return new Graphics()
            .rect(0, 0, width, defaultInputFieldSize.height)
            .fill({ color: 'white', alpha: 1 })
            .stroke({ width: 4, color: 'gray', alpha: 1, alignment: 0.5 });
    }

    private getInputCanNotInteract(isFullWidth: boolean = false) {
        const customInputBase = new CustomInputBase(this.getBackgroundOfInput(isFullWidth), '');
        customInputBase.interactive = false;
        return customInputBase;
    }

    public setGameConfig(minesCount: number | null, diamondRemain: number, totalProfit: number) {
        this.minesCount.setInputAmountText(String(minesCount ? minesCount : this.minesCount.getInputAmount().value));
        this.diamondRemain.setInputAmountText(String(diamondRemain));
        this.totalProfit.setInputAmountText(String(totalProfit.toFixed(2)));
    }

    private handleWithdrawButtonClicked() {
        // Container betting progress notice completed
        this.onBettingCompleted?.();
    }
}