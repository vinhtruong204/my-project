import { Color, Container, Sprite, Text } from "pixi.js";
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
import { Input, Select } from "@pixi/ui";
import { GameStateManager } from "./app/manage_game_states/GameStateManager";
import { GameState } from "./app/manage_game_states/GameState";
import { GameFinishPopup } from "./app/popups/GameFinishPopups";
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

  //#region  Bet container
  // const betContainer = new Container({
  //   layout: {
  //     alignContent: 'center',
  //     marginLeft: 0
  //   }
  // });

  const betText = new Text("Bet value", {
    fill: 0xffffff,
    fontSize: 32,
    fontFamily: 'Arial'
  });

  const inputSprite = Sprite.from('input_field.png');

  // Input field
  const inputBetValue = new Input({
    placeholder: '2000',
    bg: inputSprite,
    textStyle: {
      fontFamily: 'Arial',
      fill: 'black'
    },
    padding: [11, 11, 11, 11],
  });

  const MIN = 100;
  const MAX = 10000000;

  inputBetValue.value = String(MIN);
  inputBetValue.onChange.connect((text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned) {
      const n = Math.max(MIN, Math.min(MAX, Number(cleaned)));
      cleaned = String(n);
    }
    if (cleaned !== text) inputBetValue.value = cleaned;
  });

  inputBetValue.position.set(0, betText.height * 2);


  //#region  Select bombs
  const selectBombs = new Select({
    closedBG: `select.png`,
    openBG: "select.png",
    textStyle: { fill: 0x000000, fontSize: 32 },
    items: {
      items: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24'
      ],
      backgroundColor: new Color('white'),
      hoverColor: new Color('gray'),
      width: 400,
      height: 50,
      radius: 30
    },
    scrollBox: {
      width: 400,
      height: 350,
      radius: 30,
    },
  });

  selectBombs.position.set(0, inputBetValue.y + inputBetValue.height * 2);
  selectBombs.zIndex = 5;
  selectBombs.value = 0;

  selectBombs.onSelect.connect((value, text) => {
    console.log(`value = ${value}, text = ${text}`);
    GetItem.generateMatrix(value + 1);
    resetButtonPressed();
  });

  // Label select bombs
  const bombLabel = new Text("Select bombs", {
    fill: '0xffffff',
    fontFamily: 'Arial',
    fontSize: 32
  });

  bombLabel.position.set(0, selectBombs.y - bombLabel.height);
  //#endregion

  //#region  Bet button
  const betButton = new Button({
    text: 'Bet',
    width: 200,
    height: 100,
    fontSize: 32
  });

  betButton.anchor.set(0, 0);
  betButton.position.set(0, selectBombs.position.y + selectBombs.height * 2);


  let currBombsCount = 0;
  let diamondRemaining = 0;

  betButton.onPress.connect(() => {
    console.log('preset game finish popup');
    // engine.navigation.presentPopup(GameFinishPopup);
    if (GameStateManager.getInstance().getState() == GameState.BETTING) return;

    resetButtonPressed();
    selectBombs.eventMode = 'none';
    GameStateManager.getInstance().setState(GameState.BETTING);

    // Set infor text
    currBombsCount = selectBombs.value + 1;
    diamondRemaining = GlobalConfig.TOTAL_ROWS * GlobalConfig.TOTAL_COLUMNS - currBombsCount;
    updateInforText(currBombsCount, diamondRemaining);
    updateProfitText();
  });

  engine.stage.addChild(betText, inputBetValue, bombLabel, selectBombs, betButton);


  //#endregion 

  //#region Betting UI

  // Bombs count and diamonds remaining text
  const inforText = new Text('Bomb: 0  Diamond: 25', {
    fill: '0xffffff',
    fontFamily: 'Arial',
    fontSize: 32
  });
  inforText.position.set(0, betButton.y + betButton.height * 2);

  // Profit text
  const profitText = new Text('Total profit (1.00x): ', {
    fill: '0xffffff',
    fontFamily: 'Arial',
    fontSize: 32
  });
  profitText.position.set(0, inforText.y + inforText.height * 2);

  // Withdraw button
  const withdrawButton = new Button({
    text: 'Withdraw',
    width: 200,
    height: 100,
    fontSize: 32
  });

  withdrawButton.anchor.set(0, 0);

  withdrawButton.position.set(0, profitText.y + profitText.height * 2);

  withdrawButton.onPress.connect(() => {
    if (GameStateManager.getInstance().getState() == GameState.NOT_BETTING) return;
    GameStateManager.getInstance().setState(GameState.NOT_BETTING);

    selectBombs.eventMode = 'passive';
    resetButtonPressed();
  });

  engine.stage.addChild(inforText, profitText, withdrawButton);


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

      //#region Square Button
      button.onPress.connect(() => {
        if (GameStateManager.getInstance().getState() == GameState.NOT_BETTING) return;
        if (button.pressed) return;
        // Update infor text
        updateInforText(selectBombs.value + 1, --diamondRemaining);

        const sprite = Sprite.from("diamon.png");
        sprite.setSize(button.width, button.height);

        if (GetItem.getItemType(i, j)) {
          button.defaultView = sprite;
          updateProfitText();
        }
        else {
          // If item selected is bomb
          const bombSprite = Sprite.from("bomb.png");
          bombSprite.setSize(buttonSize, buttonSize);
          button.defaultView = bombSprite;

          // Change game state
          GameStateManager.getInstance().setState(GameState.NOT_BETTING);

          // Enable select bombs combo box
          selectBombs.eventMode = 'passive';

          let count = 0;
          boardContainer.children.forEach((column) => {
            column.children.forEach((child) => {
              if ((child as Button).pressed) count++;
            });
          });
          console.log("Game over! Diamon count: " + count);
          // resetButtonPressed();

        }
        button.pressed = true;
      });

      column.addChild(button);
    }

    boardContainer.addChild(column);

  }

  engine.stage.addChild(boardContainer);
  //#endregion

  //#region Utils function
  function resetButtonPressed() {
    // Reset all buttons on the board to their default state
    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;
        button.defaultView = `button.png`;
        button.setSize(buttonSize, buttonSize);
        button.pressed = false;
      });
    });
  }

  function updateInforText(bomb: number, diamond: number) {
    inforText.text = `Bomb: ${bomb}   Diamond: ${diamond}`;
  }

  function updateProfitText() {
    // Calculate diamon count
    let diamondCollected = GlobalConfig.TOTAL_ROWS * GlobalConfig.TOTAL_COLUMNS - diamondRemaining - currBombsCount;
    let exponential = 1 + diamondCollected * 0.03;
    let totalProfit = exponential * Number(inputBetValue.value);
    profitText.text = `Total profit (${exponential.toFixed(2)}): ${totalProfit.toFixed(2)}`;
  }
})();



