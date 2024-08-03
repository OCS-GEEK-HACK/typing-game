/**
 * @typedef {import('../screen-maneger').ScreenManager} ScreenManager
 */

/**
 * Represents the game screen of the application.
 */
export class GameScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
  }

  /**
   * Initializes the game screen.
   */
  initialize() {
    // ゲーム画面の初期化ロジックをここに追加
  }

  /**
   * Starts the game.
   */
  startGame() {
    this.screenManager.showScreen("game");
    // ゲームのロジックをここに追加
  }

  /**
   * Shows the game results.
   */
  showResults() {
    this.screenManager.showScreen("game-result");
    // 結果表示のロジックをここに追加
  }
}
