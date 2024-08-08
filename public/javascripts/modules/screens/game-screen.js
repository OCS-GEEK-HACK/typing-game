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
    this.words = {
      normal: [
        {
          word: "東京特許許可局",
          key: "toukyoutokkyokyokakyoku",
        }, // ...
        {
          word: "ディジタルトランスフォーメーション",
          key: "delijitarutoransufo-me-shon",
        }, // ...
        {
          word: "キジムナー",
          key: "kijimuna-",
        }, // ...
      ],
      itMode: [
        {
          word: "ディレクトリトラバーサル",
          key: "delirekutoritoraba-saru",
        }, // ...
        {
          word: "クロスサイトリクエストフォージェリ",
          key: "kurosusaitorikuesutofo-jeri",
        }, // ...
        {
          word: "アイリス認証",
          key: "airisuninshou",
        }, // ...
      ],
    };
    this.Q_No = Math.floor(Math.random() * this.words.itMode.length); //問題をランダムで出題する //flag? this.words.itMode.length:this.words.normal.length
    console.log(this.Q_No);
    this.Q_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.Q_l = this.words.itMode[this.Q_No].word.length; //計算用の文字の長さ
    this.Q_roman_i = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.Q_roman_l = this.words.itMode[this.Q_No].key.length; //計算用の文字の長さ
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
    console.log(this.screenManager.score); //screenManagerのscoreデータ
    let Q = this.words.itMode;
    let Q_roman = this.words.itMode; //問題文
    let Q_No = this.Q_No; //問題をランダムで出題する
    let Q_i = this.Q_i; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_l = this.Q_l; //計算用の文字の長さ
    let Q_roman_i = this.Q_roman_i; //回答初期値・現在単語どこまで合っているか判定している文字番号
    let Q_roman_l = this.Q_roman_l; //計算用の文字の長さ
    let count = 0,
      score = 0,
      timer = 0,
      startFlag = false;

    window.addEventListener("keydown", push_Keydown);

    let timerset = 60;
    setInterval(() => {
      if (timer / 1000 >= timerset) {
        //秒数(今回の場合は60秒まで))
        count = 0;
        startFlag = false;
        console.log("Goresult");
        this.screenManager.score = score;
        console.log(this.screenManager.score);
        this.showResults();
      }
    }, 1);
    setInterval(() => {
      if (startFlag) {
        timer++;
      }
      document.getElementById("timer").innerHTML = ""; //時間変更
      document.getElementById("point").innerHTML = ""; //得点変更
    }, 1);

    function push_Keydown(event) {
      let keyCode = event.key;
      if (Q_roman_l === Q_roman_l - Q_roman_i) {
        document.getElementById("word_kana").innerHTML = Q[Q_No].word.substring(
          Q_i,
          Q_l,
        ); //問題を書き出す
        document.getElementById("word_roman").innerHTML = Q_roman[
          Q_No
        ].key.substring(Q_roman_i, Q_roman_l); //問題を書き出す
        startFlag = true;
      }

      if (Q_roman[Q_No].key.charAt(Q_roman_i) === keyCode) {
        //押したキーが合っていたら

        Q_roman_i++; //判定する文章に１足す
        let HTML = "";
        console.log(HTML);
        for (let i = 0; i < Q_roman_i; i++) {
          HTML =
            HTML +
            '<span class="red">' +
            Q_roman[Q_No].key.substring(i, i + 1) +
            "</span>";
        }
        for (let i = Q_roman_i; i < Q_roman_l; i++) {
          HTML =
            HTML +
            '<span class="">' +
            Q_roman[Q_No].key.substring(i, i + 1) +
            "</span>";
        }
        document.getElementById("word_roman").innerHTML = HTML;

        if (Q_roman_l - Q_roman_i === 0) {
          //全部正解したら
          score += Q_roman_l;

          Q_No = Math.floor(Math.random() * Q.length); //問題をランダムで出題する
          Q_i = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          Q_l = Q[Q_No].word.length; //計算用の文字の長さ
          Q_roman_i = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          Q_roman_l = Q_roman[Q_No].key.length; //計算用の文字の長さ

          document.getElementById("word_kana").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_kana").innerHTML = Q[
            Q_No
          ].word.substring(Q_i, Q_l);
          document.getElementById("word_roman").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_roman").innerHTML =
            '<span class="">' +
            Q_roman[Q_No].key.substring(Q_roman_i, Q_roman_l) +
            "</span>"; //新たな問題を書き出す

          count++; //正答数加算
          console.log(count + "count");
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
