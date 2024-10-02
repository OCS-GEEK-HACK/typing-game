import { GameScreen } from "./screens/game-screen.js";

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
    /** @type {HTMLAudioElement} */
    this.bgmAudio = new Audio("/audio/bgm.mp3");
    /** @type {number} */
    this.se = 50;
    /** @type {boolean} */
    this.mute = true;
    /** @type {boolean} */
    this.audioPlayed = false;
    /** @type {GameScreen} */
    this.gameScreen = new GameScreen(this);
  }

  /**
   * Initializes the title screen by setting up button event listeners.
   */
  initialize() {
    this.showScreen("title");
    this.bgmAudio.volume = this.bgm * 0.01;
    this.bgmAudio.muted = this.mute;
    this.bgmAudio.loop = true;
    const soundButton = document.getElementById("sound-button");
    soundButton.addEventListener("click", () => {
      if (this.mute) {
        this.mute = false;
        this.bgmAudio.muted = this.mute;
        soundButton.dataset.mute = "on";
      } else {
        this.mute = true;
        this.bgmAudio.muted = this.mute;
        soundButton.dataset.mute = "off";
      }

      if (!this.audioPlayed) {
        this.audioPlayed = true;
        this.bgmAudio.play();
      }
    });
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

  gameInit(mode, difficulty, speaker) {
    this.gameScreen.mode = mode;
    this.gameScreen.difficulty = difficulty;
    this.gameScreen.speaker = speaker;
    // ゲームの初期化
    this.gameScreen.initialize();
  }
}
