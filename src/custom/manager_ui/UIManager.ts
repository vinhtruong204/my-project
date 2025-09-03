import { Container } from "pixi.js";
import { ContainerCapsule } from "../capsule_ui/ContainerCapsule";
import { ManualBetContainer } from "../bet_ui/container/manual_bet/ManualBetContainer";
import { AutoBetContainer } from "../bet_ui/container/auto_bet/AutoBetContainer";
import { CapsuleType } from "../capsule_ui/CapsuleType";

//**This class will manage visible of two types UI (Manual and Auto) */
export class UIManager extends Container {
    private containerCapsule: ContainerCapsule;
    private manualBetContainer: ManualBetContainer;
    private autoBetContainer: AutoBetContainer;

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.containerCapsule = new ContainerCapsule(0, 0);

        // Register handle event callback
        this.containerCapsule.onUIChange = this.handleUIChange.bind(this);

        this.manualBetContainer = new ManualBetContainer(
            this.containerCapsule.x,
            this.containerCapsule.y + this.containerCapsule.height
        );

        this.autoBetContainer = new AutoBetContainer(
            this.containerCapsule.x,
            this.containerCapsule.y + this.containerCapsule.height
        );

        this.addChild(this.containerCapsule, this.manualBetContainer, this.autoBetContainer);
    }

    private handleUIChange(capsuleType: CapsuleType | null) {
        // console.log('UI change');
        if (capsuleType === CapsuleType.AUTO) {
            this.autoBetContainer.visible = true;
            this.manualBetContainer.visible = false;

            // Update state
            this.autoBetContainer.setBetState(this.manualBetContainer.getBetState());
        }
        else {
            this.autoBetContainer.visible = false;
            this.manualBetContainer.visible = true;

            // Update state
            this.manualBetContainer.setBetState(this.autoBetContainer.getBetState());
        }
    }
}