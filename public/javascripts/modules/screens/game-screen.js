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
    this.question = this.screenManager.mode
      ? this.wordIndex.itMode
      : this.wordIndex.normal; //this.screenManager.modeでモード分岐
    this.qNumber = Math.floor(Math.random() * this.question.length); //問題をランダムで出題する //flag? this.words.itMode.length:this.words.normal.length
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
        this.dataInit();
        this.currentScore = 0; // 現在のスコア

        this.startFlag = false;
        this.screenManager.maxiumScore =
          this.screenManager < this.currentScore
            ? this.currentScore
            : this.screenManager.maxiumScore; //この画面のスコアがハイスコアを超えたらハイスコアを上書き
        console.log("Goresult");
        this.screenManager.showScreen("game-result");
      }
    };

    this.timerCount = () => {
      if (this.screenManager.currentScreen !== "game") {
        console.log("ゲーム以外の画面");

        return;
      }
      if (this.startFlag) {
        this.timer--;
      }
      document.getElementById("timer").innerHTML =
        String(Math.floor(this.timer / 60)) + ":" + String(this.timer % 60); //時間変更
      document.getElementById("point").innerHTML =
        String(this.currentScore) + "pt"; //得点変更
      console.log(this.timer);
    };

    this.timerset = 60;
    this.timer = this.timerset;
    this.startFlag = false;
    this.drawKana = () => {
      document.getElementById("word_kana").innerHTML = this.question[
        this.qNumber
      ].word.substring(0, this.qLength); //問題を書き出す
    };
    this.drawRoman = () => {
      let HTML = "";
      console.log(HTML);
      for (let i = 0; i < this.qRomanTypedLength; i++) {
        HTML =
          HTML +
          '<span class="red">' +
          this.question[this.qNumber].key.substring(i, i + 1) +
          "</span>";
      }
      for (let i = this.qRomanTypedLength; i < this.qRomanLength; i++) {
        HTML =
          HTML +
          '<span class="">' +
          this.question[this.qNumber].key.substring(i, i + 1) +
          "</span>";
      }
      document.getElementById("word_roman").innerHTML = HTML;
    };
    this.dataInit = () => {
      this.qNumber = Math.floor(Math.random() * this.question.length); //問題をランダムで出題する
      this.qTypedLength = 0; //回答初期値・現在どこまで合っているか判定している文字番号
      this.qLength = this.question[this.qNumber].word.length; //計算用の文字の長さ
      this.qRomanTypedLength = 0; //回答初期値・現在どこまで合っているか判定している文字番号
      this.qRomanLength = this.question[this.qNumber].key.length; //計算用の文字の長さ
    };
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
      console.log(keyCode);
      if (
        thisObj.qRomanLength ===
        thisObj.qRomanLength - thisObj.qRomanTypedLength
      ) {
        thisObj.drawKana();
        thisObj.drawRoman();
        thisObj.startFlag = true;
      }

      if (
        thisObj.question[thisObj.qNumber].key.charAt(
          thisObj.qRomanTypedLength,
        ) === keyCode
      ) {
        //押したキーが合っていたら

        thisObj.qRomanTypedLength++; //判定する文章に１足す
        thisObj.drawRoman();

        if (thisObj.qRomanLength - thisObj.qRomanTypedLength === 0) {
          //全部正解したら
          thisObj.currentScore += thisObj.qRomanLength;
          thisObj.dataInit();

          document.getElementById("word_kana").innerHTML = ""; //入力されていた前回の単語を削除
          thisObj.drawKana();
          document.getElementById("word_roman").innerHTML = ""; //入力されていた前回の単語を削除
          thisObj.drawRoman();

          //正答数加算
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
