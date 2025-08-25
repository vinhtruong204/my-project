import { Color, Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
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
import { RoundedBox } from "./app/ui/RoundedBox";
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
    updateGameResultText(true);
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

  betButton.onPress.connect(async () => {
    // Test popup 
    // await engine.navigation.presentPopup(GameFinishPopup);

    if (GameStateManager.getInstance().getState() == GameState.BETTING) return;

    resetButtonPressed();

    updateGameResultText(true);
    selectBombs.eventMode = 'none';
    GameStateManager.getInstance().setState(GameState.BETTING);

    // Set infor text
    currBombsCount = selectBombs.value + 1;
    diamondRemaining = GlobalConfig.TOTAL_ROWS * GlobalConfig.TOTAL_COLUMNS - currBombsCount;
    updateInforText(currBombsCount, diamondRemaining);
    updateProfitText();
    withdrawButton.visible = true;
    betButton.alpha = 0.5;
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

  //#region Withdraw button
  const withdrawButton = new Button({
    text: 'Withdraw',
    width: 200,
    height: 100,
    fontSize: 32
  });
  withdrawButton.visible = false;

  withdrawButton.anchor.set(0, 0);

  withdrawButton.position.set(0, profitText.y + profitText.height * 2);

  withdrawButton.onPress.connect(() => {
    if (GameStateManager.getInstance().getState() == GameState.NOT_BETTING) return;
    GameStateManager.getInstance().setState(GameState.NOT_BETTING);

    selectBombs.eventMode = 'passive';

    revealAllButtons();
    // resetButtonPressed();
    updateProfitText(true);

    withdrawButton.visible = false;
    betButton.alpha = 1;

    updateGameResultText();
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
        // If item selected is bomb
        else {
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
          // console.log("Game over! Diamon count: " + count);
          // resetButtonPressed();
          updateProfitText(true);

          // Dissapear withdraw and enable bet button
          withdrawButton.visible = false;
          betButton.alpha = 1;

          // 
          button.defaultView.tint = 'red'; // Set background color to red
          button.pressed = true;

          // Reveal all buttons after hit a bombs
          revealAllButtons();
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
        button.alpha = 1;
      });
    });
  }

  function updateInforText(bomb: number, diamond: number) {
    inforText.text = `Bomb: ${bomb}   Diamond: ${diamond}`;
  }

  function updateProfitText(reset: boolean = false) {
    if (reset) {
      profitText.text = `Total profit (0.00x): 000.00`;
      return;
    }

    // Calculate diamon count
    let diamondCollected = GlobalConfig.TOTAL_ROWS * GlobalConfig.TOTAL_COLUMNS - diamondRemaining - currBombsCount;
    let coefficient = 1 + diamondCollected * 0.03;
    let totalProfit = coefficient * Number(inputBetValue.value);
    profitText.text = `Total profit (${coefficient.toFixed(2)}x): ${totalProfit.toFixed(2)}`;
  }

  // Reveal all the buttons 
  function revealAllButtons() {
    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;
        if (button.pressed) return;

        const [i, j] = [button.parent!.getChildIndex(button), boardContainer.getChildIndex(button.parent!)];
        if (GetItem.getItemType(i, j)) {
          const sprite = Sprite.from("diamon.png");
          sprite.setSize(buttonSize, buttonSize);
          button.defaultView = sprite;
        }
        else {
          const bombSprite = Sprite.from("bomb.png");
          bombSprite.setSize(buttonSize, buttonSize);
          button.defaultView = bombSprite;
        }
        button.alpha = 0.5;

      });
    });
  }

  function updateGameResultText(reset: boolean = false) {
    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;
        const [i, j] = [button.parent!.getChildIndex(button), boardContainer.getChildIndex(button.parent!)];

        // Test center button notify win
        if (i === 2 && j === 2) {
          if (reset) {
            // Remove all Text children from the button when resetting
            button.children
              .filter(child => child instanceof Text)
              .forEach(child => button.removeChild(child));
            return;
          }

          // Calculate diamon count
          let diamondCollected = GlobalConfig.TOTAL_ROWS * GlobalConfig.TOTAL_COLUMNS - diamondRemaining - currBombsCount;
          let coefficient = 1 + diamondCollected * 0.03;
          let totalProfit = coefficient * Number(inputBetValue.value);

          // 
          const gameResultText = new Text();
          gameResultText.text = `${coefficient.toFixed(2)}x: ${totalProfit.toFixed(2)}`;
          gameResultText.setSize(buttonSize, buttonSize / 5);
          gameResultText.anchor = 0.5;
          gameResultText.alpha = 1;

          button.addChild(gameResultText);
        }
      });
    });
  }
})();



