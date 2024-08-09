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
    this.wordIndex = {
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
    this.qNumber = Math.floor(Math.random() * this.wordIndex.itMode.length); //問題をランダムで出題する //flag? this.words.itMode.length:this.words.normal.length
    this.currentScore = 0;
    this.qTypedLength = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.qLength = this.wordIndex.itMode[this.qNumber].word.length; //計算用の文字の長さ
    this.qRomanTypedLength = 0; //回答初期値・現在単語どこまで合っているか判定している文字番号
    this.qRomanLength = this.wordIndex.itMode[this.qNumber].key.length; //計算用の文字の長さ
    this.clearfunc = () => {
      if (this.screenManager.currentScreen !== "game") {
        console.log("ゲーム以外の画面");

        return;
      }
      if (this.timer < 0) {
        //秒数(今回の場合は60秒まで))
        this.timer = this.timerset;
        this.startFlag = false;
        console.log("Goresult");
        this.screenManager.showScreen("title");
      }
    };
    this.timerCount = () => {
      if (this.startFlag) {
        this.timer--;
      }
      document.getElementById("timer").innerHTML = ""; //時間変更
      document.getElementById("point").innerHTML = String(this.currentScore); //得点変更
      console.log(this.timer);
    };
    this.timerset = 10;
    this.timer = this.timerset;
    this.startFlag = false;
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
    let q = this.wordIndex.itMode;
    let qRoman = this.wordIndex.itMode; //問題文
    let count = 0;

    window.addEventListener("keydown", push_Keydown);

    setInterval(this.clearfunc, 1);

    setInterval(this.timerCount, 1000);

    const thisObj = this;
    function push_Keydown(event) {
      if (thisObj.screenManager.currentScreen !== "game") {
        console.log("ゲーム以外の画面");

        return;
      }
      let keyCode = event.key;
      if (
        thisObj.qRomanLength ===
        thisObj.qRomanLength - thisObj.qRomanTypedLength
      ) {
        document.getElementById("word_kana").innerHTML = q[
          thisObj.qNumber
        ].word.substring(thisObj.qTypedLength, thisObj.qLength); //問題を書き出す
        document.getElementById("word_roman").innerHTML = qRoman[
          thisObj.qNumber
        ].key.substring(thisObj.qRomanTypedLength, thisObj.qRomanLength); //問題を書き出す
        thisObj.startFlag = true;
      }

      if (
        qRoman[thisObj.qNumber].key.charAt(thisObj.qRomanTypedLength) ===
        keyCode
      ) {
        //押したキーが合っていたら

        thisObj.qRomanTypedLength++; //判定する文章に１足す
        let HTML = "";
        console.log(HTML);
        for (let i = 0; i < thisObj.qRomanTypedLength; i++) {
          HTML =
            HTML +
            '<span class="red">' +
            qRoman[thisObj.qNumber].key.substring(i, i + 1) +
            "</span>";
        }
        for (let i = thisObj.qRomanTypedLength; i < thisObj.qRomanLength; i++) {
          HTML =
            HTML +
            '<span class="">' +
            qRoman[thisObj.qNumber].key.substring(i, i + 1) +
            "</span>";
        }
        document.getElementById("word_roman").innerHTML = HTML;

        if (thisObj.qRomanLength - thisObj.qRomanTypedLength === 0) {
          //全部正解したら
          thisObj.currentScore += thisObj.qRomanLength;

          thisObj.qNumber = Math.floor(Math.random() * q.length); //問題をランダムで出題する
          thisObj.qTypedLength = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          thisObj.qLength = q[thisObj.qNumber].word.length; //計算用の文字の長さ
          thisObj.qRomanTypedLength = 0; //回答初期値・現在どこまで合っているか判定している文字番号
          thisObj.qRomanLength = qRoman[thisObj.qNumber].key.length; //計算用の文字の長さ

          document.getElementById("word_kana").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_kana").innerHTML = q[
            thisObj.qNumber
          ].word.substring(thisObj.qTypedLength, thisObj.qLength);
          document.getElementById("word_roman").innerHTML = ""; //入力されていた前回の単語を削除
          document.getElementById("word_roman").innerHTML =
            '<span class="">' +
            qRoman[thisObj.qNumber].key.substring(
              thisObj.qRomanTypedLength,
              thisObj.qRomanLength,
            ) +
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
