/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

import { GameResultScreen } from "./game-result-screen.js";

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
    /** @type {GameResultScreen} */
    this.gameResultScreen = new GameResultScreen(screenManager);
    this.gameResultScreen.initialize();
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
      it: [
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
    /**
     * @type {string[]}
     */
    this.audioPaths = [];
    /** @type {HTMLAudioElement} */
    this.audio = new Audio();
    /**
     * it or normal
     */
    this.mode = "";
    /**
     * difficulty
     */
    this.difficulty = "";
    /**
     * @type {{ word: string; key: string; }[]}
     */
    this.questions = [];
    /**
     * @type {{ word: string; key: string; } | undefined}
     */
    this.currentQuestion = undefined;
    this.currentIndex = 0;
    this.currentTotal = 0;
    this.kanaView = document.getElementById("wordKana");
    this.romanView = document.getElementById("wordRoman");
    this.isGenerating = false;
    this.limitTime = 30000; // ms

    window.addEventListener("keydown", (e) => this.pushKeydown(e));
  }

  /**
   * Initializes the game screen.
   */
  async initialize() {
    // ゲーム画面の初期化ロジックをここに追加
    if (this.isGenerating) return; // 生成中は処理はじく
    this.questions = this.words[this.mode];
    console.log("生成中");
    // 音声生成
    await this.generateAudio();
    console.log("生成完了");
    this.audio.volume = this.screenManager.volume * 0.01;
    this.screenManager.showScreen("game");
    this.startGame();
  }

  /**
   * Starts the game.
   */
  startGame() {
    // ゲームのロジックをここに追加
    this.currentIndex = 0;
    this.currentTotal = 0;
    // 問題の選択
    this.currentQuestion =
      this.questions[Math.floor(Math.random() * this.questions.length)];
    // 問題の表示
    this.updateQuestion();
    this.updateScoreDisplay();
    // タイマーの開始
    this.startTimer();
  }

  /**
   *
   * @param {KeyboardEvent} event
   * @returns
   */
  pushKeydown(event) {
    if (this.screenManager.currentScreen !== "game") {
      console.log("ゲーム以外の画面");

      return;
    }

    const keyCode = event.key;

    // あってるかの処理
    if (Array.from(this.currentQuestion.key)[this.currentIndex] === keyCode) {
      console.log("正解");
      // 色変える
      document.querySelectorAll("#wordRoman span").forEach((ele, index) => {
        if (index <= this.currentIndex) {
          ele.classList.add("red");
        }
      });

      // 最後の文字でなければインクリメント
      if (this.currentIndex < this.currentQuestion.key.length - 1) {
        this.currentIndex++;
      } else {
        // 最後の文字なので次の問題へ
        this.currentIndex = 0;
        // 加算
        this.currentTotal++;
        this.updateScoreDisplay();
        // 問題の選択
        this.currentQuestion =
          this.questions[Math.floor(Math.random() * this.questions.length)];
        // 問題の表示
        this.updateQuestion();
      }
    }
  }

  /**
   * 問題の表示
   */
  updateQuestion() {
    this.kanaView.innerHTML = this.currentQuestion.word;
    const spanFragment = document.createDocumentFragment();
    Array.from(this.currentQuestion.key).forEach((key) => {
      const spanElement = document.createElement("span");
      spanElement.innerHTML = key;
      spanFragment.appendChild(spanElement);
    });
    this.romanView.innerHTML = "";
    this.romanView.appendChild(spanFragment);

    // 音声再生
    this.playAudio();
  }

  startTimer() {
    const startTime = Date.now();

    const timerId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= this.limitTime) {
        clearInterval(timerId);
        this.timeUp(); // 制限時間切れの処理を呼び出す
      } else {
        this.updateTimerDisplay(this.limitTime - elapsedTime); // 残り時間を表示する更新処理
      }
    }, 20); // 20ミリ秒ごとにチェック（画面の更新のため）
  }

  /**
   * 制限時間切れの処理
   */
  timeUp() {
    this.audio.pause();
    this.showResults();
  }

  /**
   * 残り時間の表示を更新する処理
   * @param {number} remainingTime 残り時間（ミリ秒）
   */
  updateTimerDisplay(remainingTime) {
    const timerElement = document.getElementById("timer");
    timerElement.textContent = (remainingTime / 1000).toFixed(2); // 秒数で表示
  }

  updateScoreDisplay() {
    const socreElement = document.getElementById("point");
    socreElement.innerHTML = this.currentTotal;
  }

  /**
   * Shows the game results.
   */
  showResults() {
    this.screenManager.showScreen("game-result");
    // 結果表示のロジックをここに追加
    // gameResultScreenをいじる
  }

  /**
   * 音声の生成
   */
  async generateAudio() {
    this.isGenerating = true;
    const paths = await Promise.all(
      this.questions.map(async (question) => {
        const response = await fetch(`/voicevox?text=${question.word}`, {
          cache: "force-cache",
        });
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
      }),
    );
    console.log(paths);
    this.audioPaths = paths;
    this.isGenerating = false;
  }

  /**
   * 音声再生
   */
  playAudio() {
    const currentQuestionIndex = this.questions.findIndex(
      (question) => question.key === this.currentQuestion.key,
    );
    this.audio.src = this.audioPaths[currentQuestionIndex];
    this.audio.play();
  }
}
