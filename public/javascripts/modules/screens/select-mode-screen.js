/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

/**
 * Represents the select mode screen of the application.
 */
export class SelectModeScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
  }

  /**
   * Initializes the select mode screen.
   */
  initialize() {
    // 難易度選択画面の初期化ロジックをここに追加
    const buttons = document.querySelectorAll(
      "[data-screen='select-mode'] button[data-action]",
    );
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const action = event.target.dataset.action;
        this.handleAction(action);
      });
    });
  }

  /**
   * Handles the action based on the button's data-action attribute.
   *
   * ボタンクリック時の処理
   *
   * @param {string} action - The action to handle.
   */
  handleAction(action) {
    // 現在の難易度取得
    const difficulty = document.querySelector(
      'input[name="drone"]:checked',
    ).value;
    console.log(difficulty);

    if (action === "game-it") {
      this.screenManager.gameInit("it", difficulty);
    } else if (action === "game-normal") {
      this.screenManager.gameInit("normal", difficulty);
    } else if (action === "back") {
      this.screenManager.showScreen("title");
    }
  }
}
