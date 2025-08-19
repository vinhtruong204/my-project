import { Container } from "pixi.js";
import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import { Button } from "./app/ui/Button";
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
      alignContent: 'space-evenly',
      flexWrap: 'wrap',
      gap: 4
    },
  });

  for (let j = 0; j < 5; j++) {
    const innerContainer = new Container({
      layout: {
        width: '80%',
        height: '5%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignContent: 'center',
        flexWrap: 'wrap',
      },
    });

    // Create five buttons
    for (let i = 0; i < 5; i++) {
      const button = new Button({
        text: "",
      });

      button.position = { x: i * button.width, y: 0 };
      button.setSize(100, 100);

      button.onPress.connect(() => {
        console.log("Open the box!");
        button.defaultView = "logo.svg";
      });

      // Add the button to the container
      innerContainer.addChild(button);
      innerContainer.position.set(0, j * button.height);
    }

    container.addChild(innerContainer);
  }

  engine.stage.addChild(container);

})();
