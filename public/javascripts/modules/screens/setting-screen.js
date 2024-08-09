/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

/**
 * Represents the settings screen of the application.
 */
export class SettingScreen {
  /**
   * @param {ScreenManager} screenManager - The screen manager to control screen transitions.
   */
  constructor(screenManager) {
    /** @type {ScreenManager} */
    this.screenManager = screenManager;
  }

  /**
   * Initializes the settings screen.
   */
  initialize() {
    const audioElement = document.getElementById("btn_audio");
    const volumeSlider = document.getElementById("volume");

    // スライダーの値をオーディオの音量に反映
    audioElement.volume = volumeSlider.value;

    // スライダーが動いたときに音量を調整
    volumeSlider.addEventListener("input", (e) => {
      audioElement.volume = e.target.value;
    });
    // 設定画面の初期化ロジックをここに追加
    document.getElementById("volume").value = this.screenManager.volume;
    document.getElementById("bgm").value = this.screenManager.bgm;
    document.getElementById("se").value = this.screenManager.se;

    // `this` を正しくバインディングするためにアロー関数を使用
    document
      .getElementById("volume")
      .addEventListener("input", (e) => this.handleChange(e));
    document
      .getElementById("bgm")
      .addEventListener("input", (e) => this.handleChange(e));
    document
      .getElementById("se")
      .addEventListener("input", (e) => this.handleChange(e));
  }

  /**
   * Handles changes to input elements.
   * @param {InputEvent} e - The input event object.
   */
  handleChange(e) {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const id = target.id;
      const value = parseInt(target.value);

      switch (id) {
        case "volume":
          this.screenManager.volume = value;
          break;
        case "bgm":
          this.screenManager.bgm = value;
          break;
        case "se":
          this.screenManager.se = value;
          break;
        default:
          console.warn(`Unexpected input ID: ${id}`);
          break;
      }
    } else {
      console.error("Unexpected event target type");
    }
  }
}
