/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
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
    this.startGame();
  }

  /**
   * Starts the game.
   */
  startGame() {
    this.screenManager.showScreen("game");
    // ゲームのロジックをここに追加

    let Q = [
      "ディレクトリトラバーサル",
      "基本情報技術者試験",
      "クロスサイトリクエストフォージェリ",
      "アイリス認証",
    ]; //問題文
    let Q_roman = [
      "delirekutoritoraba-saru",
      "kihonjouhougijutushashiken",
      "kurosusaitorikuesutofo-jeri",
      "airisuninshou",
    ]; //問題文
    let Q_No = Math.floor(Math.random() * Q_roman.length); //問題をランダムで出題する

    let Q_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_l = Q[Q_No].length; //計算用の文字の長さ
    let Q_roman_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_roman_l = Q_roman[Q_No].length; //計算用の文字の長さ

    window.addEventListener("keydown", push_Keydown);

    function push_Keydown(event) {
      let keyCode = event.key;
      if (Q_roman_l === Q_roman_l - Q_roman_i) {
        document.getElementById("word_kana").innerHTML = Q[Q_No].substring(
          Q_i,
          Q_l,
        ); //問題を書き出す
        document.getElementById("word_roman").innerHTML = Q_roman[
          Q_No
        ].substring(Q_roman_i, Q_roman_l); //問題を書き出す
      }

      if (Q_roman[Q_No].charAt(Q_roman_i) === keyCode) {
        //押したキーが合っていたら

        Q_roman_i++; //判定する文章に１足す
        document.getElementById("word_roman").innerHTML =
          '<span class="red">' +
          Q_roman[Q_No].substring(0, Q_roman_i) +
          '</span><span class="">' +
          Q_roman[Q_No].substring(Q_roman_i, Q_roman_l) +
          "</span>"; //問題を書き出す

        if (Q_roman_l - Q_roman_i === 0) {
          //全部正解したら

          Q_No = Math.floor(Math.random() * Q.length); //問題をランダムで出題する
          Q_i = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          Q_l = Q[Q_No].length; //計算用の文字の長さ
          Q_roman_i = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          Q_roman_l = Q_roman[Q_No].length; //計算用の文字の長さ

          document.getElementById("word_kana").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_kana").innerHTML = Q[Q_No].substring(
            Q_i,
            Q_l,
          );
          document.getElementById("word_roman").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_roman").innerHTML =
            '<span class="">' +
            Q_roman[Q_No].substring(Q_roman_i, Q_roman_l) +
            "</span>"; //新たな問題を書き出す
        }
      }
    }
  }

  /**
   * Shows the game results.
   */
  showResults() {
    this.screenManager.showScreen("game-result");
    // 結果表示のロジックをここに追加
  }
}
