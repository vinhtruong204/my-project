import { Container } from "pixi.js";

export class GameScreen extends Container {
    public mainContainer: Container;

    constructor() {
        super();
        
        this.mainContainer = new Container();
        this.addChild(this.mainContainer);
        
    }
}