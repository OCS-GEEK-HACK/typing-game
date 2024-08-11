/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

export class GameResultScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
    this.modal = document.querySelector(".share-modal");
    this.overlay = document.querySelector(".modal-overlay");
  }

  /**
   * Initializes the settings screen.
   */
  initialize() {
    const buttons = document.querySelectorAll(
      "[data-screen='game-result'] [data-action]",
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
    if (action === "replay") {
      this.screenManager.showScreen("game");
      this.screenManager.gameScreen.startGame();
    } else if (action === "change-mode") {
      this.screenManager.showScreen("select-mode");
    } else if (action === "home") {
      this.screenManager.showScreen("title");
    } else if (action === "share") {
      this.modal.classList.remove("none");
      this.overlay.classList.remove("none");
    } else if (action === "close-modal") {
      this.modal.classList.add("none");
      this.overlay.classList.add("none");
    }
  }

  showResult() {
    const nowScore = document.getElementById("score");
    const todayScore = document.getElementById("today-score");
    const hiScore = document.getElementById("hi-score");
    nowScore.innerHTML = this.screenManager.gameScreen.currentTotal;
    todayScore.innerHTML = this.screenManager.gameScreen.currentTotal;
    hiScore.innerHTML = this.screenManager.gameScreen.highScore;
  }
}
