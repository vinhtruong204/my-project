import { Color, Container, Sprite, Text, Ticker } from "pixi.js";
import { setEngine } from "./app/getEngine";
import { MainScreen } from "./app/screens/main/MainScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
import "@pixi/sound";
import { Button } from "./app/ui/Button";
import { GetItem } from "./app/utils/GetItem";
import { GlobalConfig } from "./app/config/GlobalConfig";
import { Input, Select } from "@pixi/ui";
import { GameStateManager } from "./app/manage_game_states/GameStateManager";
import { GameState } from "./app/manage_game_states/GameState";
import { GetCoefficientProfit } from "./app/utils/GetCoefficientProfit";
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

  const betText = new Text({
    text: "Bet value", style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial'
    }
  });

  var balance = 10000;
  //#region Balance text
  const balanceText = new Text({
    text: `Balance: ${balance.toFixed(2)}`,
    style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial'
    }
  });

  balanceText.position.set(betText.width * 2, 0);

  const inputSprite = Sprite.from('input_field.png');

  //#region Input field
  const inputBetValue = new Input({
    bg: inputSprite,
    textStyle: {
      fontFamily: 'Arial',
      fill: 'black'
    },
    padding: [11, 11, 11, 11],
  });

  // Handle bet value change
  const bet_config = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 100, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 40, 60, 80, 100, 120, 140, 160000, 180, 200, 300, 400, 500000, 600000, 700000, 800000, 900000, 1000000];
  var currBetIndex = 0;
  var isMouseDown = false;
  var isIncreaseBet = false;
  var isDecreaseBet = false;

  // Initial bet value
  updateBetValueText(currBetIndex);

  //#region Handle change bet value
  inputBetValue.onChange.connect((text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned !== text) inputBetValue.value = cleaned;
  });

  inputBetValue.position.set(0, betText.height * 2);

  inputBetValue.interactiveChildren = true;

  //#region Decrease bet value
  // Add two triangles to inputBetValue: one pointing down, one pointing up
  const triangleDown = Sprite.from('triangle.png');
  triangleDown.scale.set(0.5, 0.5);
  triangleDown.position.set(inputBetValue.width - triangleDown.width, 20);
  triangleDown.zIndex = 10;
  triangleDown.visible = false;
  triangleDown.cursor = 'pointer';
  triangleDown.interactive = true;
  inputBetValue.addChild(triangleDown);

  // Handle decrease bet value event
  triangleDown.on('pointerdown', () => {
    if (GameStateManager.getInstance().getState() === GameState.BETTING) return;

    // TODO: Decrease bet val
    // if (currBetIndex - 1 >= 0)
    //   updateBetValueText(--currBetIndex);

    isMouseDown = true;
    isDecreaseBet = true;
    isIncreaseBet = false;
  });

  //#region Increase bet value
  const triangleUp = Sprite.from('triangle.png');
  triangleUp.scale.set(0.5, -0.5); // Flip vertically for up
  triangleUp.position.set(inputBetValue.width - triangleUp.width, 17);
  triangleUp.zIndex = 10;
  triangleUp.visible = false;
  triangleUp.cursor = 'pointer';
  triangleUp.interactive = true;
  inputBetValue.addChild(triangleUp);

  triangleUp.on('pointerdown', () => {
    if (GameStateManager.getInstance().getState() === GameState.BETTING) return;

    // TODO: Increase bet val
    // if (currBetIndex + 1 < bet_config.length)
    //   updateBetValueText(++currBetIndex);

    isMouseDown = true;
    isIncreaseBet = true;
    isDecreaseBet = false;
  });

  // Handle hover event
  inputBetValue.on('pointerenter', () => {
    triangleUp.visible = true;
    triangleDown.visible = true;
  });

  inputBetValue.on('pointerout', () => {
    triangleUp.visible = false;
    triangleDown.visible = false;
  });

  inputBetValue.on('pointerupoutside', () => {
    triangleUp.visible = false;
    triangleDown.visible = false;
    isMouseDown = false;
    isDecreaseBet = false;
    isIncreaseBet = false;
  });

  inputBetValue.on('pointerup', () => {
    isMouseDown = false;
    isIncreaseBet = false;
    isDecreaseBet = false;
  });

  //#region Change value every 0.1 second
  var elapsed = 0;
  engine.ticker.add((time) => {
    if (!isMouseDown) return;

    // console.log(time.elapsedMS);
    elapsed += time.elapsedMS / 1000;

    // Change bet value every 100ms when mouse is pressed
    if (elapsed >= 0.1) {
      elapsed = 0; // reset
      if (isIncreaseBet && currBetIndex + 1 < bet_config.length) updateBetValueText(++currBetIndex);
      if (isDecreaseBet && currBetIndex - 1 >= 0) updateBetValueText(--currBetIndex);
    }

  });


  //#endregion

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
    currBombsCount = value + 1;
    GetItem.generateMatrix(value + 1);
    resetButtonPressed();
    updateGameResultText(true);
  });

  // Label select bombs
  const bombLabel = new Text({
    text: "Select bombs", style: {
      fill: '0xffffff',
      fontFamily: 'Arial',
      fontSize: 32
    }
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
    if (!isEnoughBalance(Number(inputBetValue.value))) {
      alert("Not enough balance!");
      return;
    }

    resetButtonPressed();

    updateGameResultText(true);

    updateBalaceText(Number(inputBetValue.value), false);
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

  engine.stage.addChild(betText, balanceText, inputBetValue, bombLabel, selectBombs, betButton);


  //#endregion 

  //#region Betting UI

  // Bombs count and diamonds remaining text
  const inforText = new Text({
    text: 'Bomb: 0  Diamond: 25',
    style: {
      fill: '0xffffff',
      fontFamily: 'Arial',
      fontSize: 32
    }
  });
  inforText.position.set(0, betButton.y + betButton.height * 2);

  // Profit text
  const profitText = new Text({
    text: 'Total profit (1.00x): ', style: {
      fill: '0xffffff',
      fontFamily: 'Arial',
      fontSize: 32
    }
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
    if (GameStateManager.getInstance().getState() === GameState.NOT_BETTING) return;
    if (hasNoPressedButtons()) return;
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

  //#region Auto bet UI
  // Number of auto plays
  const autoText = new Text({
    text: "Auto play",
    style: {
      fill: 0xffffff,
      fontSize: 32,
      fontFamily: 'Arial'
    }
  });

  autoText.position.set(0, withdrawButton.y + withdrawButton.height);

  const inputNumberAuto = new Input({
    bg: `input_field.png`,
    placeholder: 'Infinity',
    value: '1',
    textStyle: {
      fontFamily: 'Arial',
      fill: 'black'
    },
    padding: [11, 11, 11, 11],
  });

  inputNumberAuto.position.set(0, autoText.y + autoText.height * 2);

  //#region Start Auto button
  const startAutoButton = new Button({
    text: 'Start',
    width: 200,
    height: 100,
    fontSize: 32
  });

  startAutoButton.anchor.set(0);
  startAutoButton.position.set(0, inputNumberAuto.y + inputNumberAuto.height * 2);

  // Handle start auto event 
  startAutoButton.onPress.connect(() => {
    if (GameStateManager.getInstance().getState() === GameState.BETTING) return;

    updateGameResultText(true);
    if (hasNoSelectedButtons()) {
      alert('Please select at least 1 square before starting!');
      return;
    }

    GameStateManager.getInstance().setState(GameState.BETTING);

    const ticker = new Ticker();

    let autoElapsed = 0;
    let autoCount = Number(inputNumberAuto.value);
    let phase: "waiting" | "reveal" | "reset" = "waiting";


    ticker.add((time) => {
      autoElapsed += time.elapsedMS / 1000;

      if (autoElapsed >= 1) {
        autoElapsed = 0;

        if (phase === "waiting") {


          // Generate matrix
          GetItem.generateMatrix(selectBombs.value + 1);
          // reveal
          revealAllButtons();
          updateProfitText();
          updateBalaceTextAfterAuto();
          phase = "reset";
        }
        else if (phase === "reset") {
          // reset after delay
          resetButtonPressedWithoutResetSelected();
          if (!isEnoughBalance(Number(inputBetValue.value))) {
            alert("Not enough balance!");
            ticker.stop();
            return;
          }


          // Update text balance
          phase = "waiting";
          autoCount--;
          if (autoCount > 0)
            updateBalaceText(Number(inputBetValue.value), false);

          if (autoCount <= 0) {
            GameStateManager.getInstance().setState(GameState.NOT_BETTING);
            ticker.stop();
          }
        }
      }
    });

    ticker.start();
  });

  engine.stage.addChild(autoText, inputNumberAuto, startAutoButton);


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
        if (GameStateManager.getInstance().getState() == GameState.NOT_BETTING) {
          button.selected = true;
          return;
        }

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
        button.selected = false;
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
    let coefficient = 1 + diamondCollected * GetCoefficientProfit.getCoefficient(currBombsCount);
    let totalProfit = coefficient * Number(inputBetValue.value);
    profitText.text = `Total profit (${coefficient.toFixed(2)}x): ${totalProfit.toFixed(2)}`;
  }

  // Reveal all the buttons 
  function revealAllButtons() {
    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;

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
        if (button.pressed || button.selected) button.alpha = 1;
        else button.alpha = 0.5;

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
          let coefficient = 1 + diamondCollected * GetCoefficientProfit.getCoefficient(currBombsCount);
          let totalProfit = coefficient * Number(inputBetValue.value);

          // 
          const gameResultText = new Text();
          gameResultText.text = `${coefficient.toFixed(2)}x: ${totalProfit.toFixed(2)}`;
          gameResultText.setSize(buttonSize, buttonSize / 5);
          gameResultText.anchor = 0.5;
          gameResultText.alpha = 1;

          button.addChild(gameResultText);

          // Update balance after withdraw
          updateBalaceText(totalProfit, true);
        }
      });
    });
  }

  function updateBetValueText(currBetIndex: number) {
    // Update bet text
    inputBetValue.value = String(bet_config[currBetIndex]);
  }

  function hasNoPressedButtons(): boolean {
    return boardContainer.children.every(column =>
      column.children.every(child => !(child as Button).pressed)
    );
  }

  function hasNoSelectedButtons(): boolean {
    return boardContainer.children.every(column =>
      column.children.every(child => !(child as Button).selected)
    );
  }

  function updateBalaceText(value: number, receive: boolean) {
    if (receive)
      balance += value;
    else {
      balance -= value;
    }

    balanceText.text = `Balance: ${balance.toFixed(2)}`
  }

  function isEnoughBalance(value: number): boolean {
    return balance - value >= 0;
  }

  function resetButtonPressedWithoutResetSelected() {
    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;
        button.defaultView = `button.png`;
        button.setSize(buttonSize, buttonSize);
        button.pressed = false;
        button.alpha = button.selected ? 0.75 : 1;
      });
    });
  }

  function updateBalaceTextAfterAuto() {

    let diamondCollected = 0;
    let bombFlag = false;

    boardContainer.children.forEach((column) => {
      column.children.forEach((child) => {
        const button = child as Button;
        if (button.selected) {
          const [i, j] = [button.parent!.getChildIndex(button), boardContainer.getChildIndex(button.parent!)];
          if (GetItem.getItemType(i, j)) {
            diamondCollected++;
          }
          else {
            bombFlag = true;
          }
        }
      });
    });

    let coefficient = 1 + diamondCollected * GetCoefficientProfit.getCoefficient(currBombsCount);
    let totalProfit = coefficient * Number(inputBetValue.value);
    if (!bombFlag)
      updateBalaceText(totalProfit, true);
  }
})();



