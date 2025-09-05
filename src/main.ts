import { Sprite } from "pixi.js";
import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import { UIManager } from "./custom/manager_ui/UIManager";
import { BoardContainer } from "./custom/_game/board/BoardContainer";
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  // Initialize the user settings
  userSettings.init();

  // Show the load screen
  // await engine.navigation.showScreen(LoadScreen);
  // Show the main screen once the load screen is dismissed
  await engine.navigation.showScreen(MainScreen);

  (globalThis as any).__PIXI_APP__ = engine;

  // Add background
  const bg = Sprite.from("green_wall.jpg");
  bg.setSize(window.innerWidth, window.innerHeight);
  bg.scale = 1;
  engine.stage.addChild(bg);

  // UI manager
  const uiManager = new UIManager(100, 50);
  engine.stage.addChild(uiManager);

  // Board container
  const boardContainer = new BoardContainer(uiManager.x + uiManager.width, uiManager.y);
  engine.stage.addChild(boardContainer);

  // Adjust position to align center items
  uiManager.position.set((engine.screen.width - uiManager.width - boardContainer.width) / 2, 50);
  boardContainer.position.set(uiManager.x + uiManager.width + 50, uiManager.y);

  // Adjust position to align center items
  window.onresize = onWindowResize;

  function onWindowResize() {
    uiManager.position.set((engine.screen.width - uiManager.width - boardContainer.width) / 2, 50);
    boardContainer.position.set(uiManager.x + uiManager.width + 50, uiManager.y);
  }
})();
