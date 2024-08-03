/**
 * @typedef {import('../screen-maneger').ScreenManager} ScreenManager
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
    document
      .querySelector("[data-action='game']")
      .addEventListener("click", () => {
        this.screenManager.showScreen("game");
      });
  }
}
