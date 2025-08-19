import { Container } from "pixi.js";
import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import { FancyButton } from "@pixi/ui";
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

  const container = new Container({
    layout: {
      width: '80%',
      height: '80%',
      justifyContent: 'center',
      flexDirection: 'row',
      alignContent: 'center',
      flexWrap: 'wrap',
      gap: 15
    },
  });

  engine.stage.addChild(container);

  // Create five buttons
  for (let i = 0; i < 5; i++) {
    const button = new FancyButton({
      text: "",
      defaultView: "icon-pause.png",
      anchor: 0.5,
    });

    button.position = { x: i * (button.width * 4), y: 0 };
    button.setSize(100, 50)

    // Add the button to the container
    container.addChild(button);
  }
})();
