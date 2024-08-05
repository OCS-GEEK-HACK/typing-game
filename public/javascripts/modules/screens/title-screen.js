/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

/**
 * Represents the title screen of the application.
 */
export class TitleScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
  }

  /**
   * Initializes the title screen by setting up button event listeners.
   */
  initialize() {
    const buttons = document.querySelectorAll(
      "[data-screen='title'] button[data-action]",
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
    if (action === "start") {
      this.screenManager.showScreen("select-mode");
    } else if (action === "setting") {
      this.screenManager.showScreen("setting");
    } else if (action === "terms") {
      alert("利用規約の画面は実装されていません。");
    } else if (action === "credits") {
      alert("クレジットの画面は実装されていません。");
    }
  }
}
