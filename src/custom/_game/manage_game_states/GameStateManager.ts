import { GameStateEvent } from "../../events/GameStateEvent";
import { globalEmitter } from "../../events/GlobalEmitter";
import { GameState } from "./GameState";

export class GameStateManager {
  private static instance: GameStateManager;

  private currentState: GameState = GameState.NOT_BETTING;

  private constructor() { }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public getState(): GameState {
    return this.currentState;
  }

  public setState(state: GameState): void {
    globalEmitter.emit(GameStateEvent.STATE_CHANGE, state);
    this.currentState = state;
  }

  public isBetting(): boolean {
    return this.currentState === GameState.BETTING;
  }
}
