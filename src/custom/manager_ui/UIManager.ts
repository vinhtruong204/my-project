import { Container } from "pixi.js";
import { ContainerCapsule } from "../capsule_ui/ContainerCapsule";
import { ManualBetContainer } from "../bet_ui/container/ManualBetContainer";

//**This class will manage visible of two types UI (Manual and Auto) */
export class UIManager extends Container {
    private containerCapsule: ContainerCapsule;
    private manualBetContainer: ManualBetContainer;

    constructor(x: number, y: number) {
        super({ x: x, y: y });

        this.containerCapsule = new ContainerCapsule(0, 0);

        this.manualBetContainer = new ManualBetContainer(
            this.containerCapsule.x,
            this.containerCapsule.y + this.containerCapsule.height
        );

        this.addChild(this.containerCapsule, this.manualBetContainer);
    }
}