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
    this.Q = [
      "ディレクトリトラバーサル",
      "基本情報技術者試験",
      "クロスサイトリクエストフォージェリ",
      "アイリス認証",
    ]; //問題文
    this.Q_roman = [
      "delirekutoritoraba-saru",
      "kihonjouhougijutushashiken",
      "kurosusaitorikuesutofo-jeri",
      "airisuninshou",
    ]; //問題文
    this.Q_No = Math.floor(Math.random() * this.Q_roman.length); //問題をランダムで出題する
    this.Q_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.Q_l = this.Q[this.Q_No].length; //計算用の文字の長さ
    this.Q_roman_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.Q_roman_l = this.Q_roman[this.Q_No].length; //計算用の文字の長さ
    //関数内から直接触れない!
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
    // ゲームのロジックをここに追加
    let Q = this.Q;
    let Q_roman = this.Q_roman; //問題文
    let Q_No = this.Q_No; //問題をランダムで出題する
    let Q_i = this.Q_i; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_l = this.Q_l; //計算用の文字の長さ
    let Q_roman_i = this.Q_roman_i; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_roman_l = this.Q_roman_l; //計算用の文字の長さ
    let count = 0;
    console.log(this.screenManager.score + "score"); //screenManagerのscoreデータ

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
        let HTML = "";
        console.log(HTML);
        for (let i = 0; i < Q_roman_i; i++) {
          HTML =
            HTML +
            '<span class="red">' +
            Q_roman[Q_No].substring(i, i + 1) +
            "</span>";
        }
        for (let i = Q_roman_i; i < Q_roman_l; i++) {
          HTML =
            HTML +
            '<span class="">' +
            Q_roman[Q_No].substring(i, i + 1) +
            "</span>";
        }
        document.getElementById("word_roman").innerHTML = HTML;

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

          count++; //正答数加算
          console.log(count + "count");
        }
      }

      if (count > 2) {
        console.log("Goresult");
        this.showResults(); //呼び出せない!?
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
