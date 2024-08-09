/**
 * Manages the display of different screens in the application.
 */
export class ScreenManager {
  constructor() {
    /** @type {NodeListOf<Element>} */
    this.screens = document.querySelectorAll("[data-screen]");
    /** @type {string | null} */
    this.currentScreen = null;
    /** @type {number} */
    this.volume = 50;
    /** @type {number} */
    this.bgm = 50;
    /** @type {number} */
    this.se = 50;
    /** @type {boolean} */
    this.mute = false;
    /** @type {number} */
    this.maxiumScore = 0;
    /** @type {boolean} */
    this.mode = false; //false:normal,true:it
    /** @type {number} */
    this.difficulty = 2; //0:easy,1:normal,2:hard
  }

  /**
   * Shows the specified screen and hides others.
   *
   * 画面の切り替え
   *
   * @param {string} screenName - The name of the screen to display.
   */
  showScreen(screenName) {
    this.screens.forEach((screen) => {
      if (screen.dataset.screen === screenName) {
        screen.classList.remove("none");
        this.currentScreen = screenName;
      } else {
        screen.classList.add("none");
      }
    });
  }
}
