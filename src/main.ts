import { Container, Sprite } from "pixi.js";
import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import { Button } from "./app/ui/Button";
import { GetItem } from "./app/game_mechanic/GetItem";
import { GlobalConfig } from "./app/config/GlobalConfig";
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
  bg.setSize(engine.canvas.width, engine.canvas.height);
  bg.scale = 1;
  engine.stage.addChild(bg);

  //#region  Bet ui
  // const betContainer = new Container();

  // const betText = new Text({
  //   text: 'Bet value',
  //   style: {
  //     fontFamily: 'Arial',
  //     fontSize: 32,
  //     fill: 0xffffff, // White color
  //     align: 'left',
  //   }
  // })
  // // betContainer.addChild(betText);

  // const input = new Input({
  //   bg: Sprite.from('input_field.png'),
  //   placeholder: 'Enter number',
  //   padding: [11, 11, 11, 11]

  // });

  // betContainer.addChild(input);
  //#endregion 

  //#region  Board game ui
  const boardContainer = new Container({
    width: engine.canvas.width,
    height: engine.canvas.height,
  });

  boardContainer.position = { x: 900, y: 5 };




  // boardContainer.pivot.set(boardContainer.width / 2, boardContainer.height / 2);
  const buttonSize = 200;

  // Matrix 
  for (let j = 0; j < GlobalConfig.TOTAL_ROWS; j++) {
    const column = new Container();

    column.position.set(j * buttonSize, 130);
    //** Create five buttons*/ 
    for (let i = 0; i < GlobalConfig.TOTAL_COLUMNS; i++) {
      const button = new Button({ text: "" });

      button.position.y = i * buttonSize;
      button.setSize(buttonSize, buttonSize);

      button.onPress.connect(() => {
        if (button.pressed) return;
        const sprite = Sprite.from("diamon.png");
        sprite.setSize(button.width, button.height);

        if (GetItem.getItemType(i, j))
          button.defaultView = sprite;
        else {
          const bombSprite = Sprite.from("bomb.png");
          bombSprite.setSize(buttonSize, buttonSize);
          button.defaultView = bombSprite;
        }
        button.pressed = true;
      });

      column.addChild(button);
    }

    boardContainer.addChild(column);

  }
  //#endregion

  engine.stage.addChild(boardContainer);


})();
