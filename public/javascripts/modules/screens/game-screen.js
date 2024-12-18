/**
 * @typedef {import('../screen-manager').ScreenManager} ScreenManager
 */

import { GameResultScreen } from "./game-result-screen.js";
import { data } from "./mondai.js";

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
    this.words = data;

    /**
     * @type {string[]}
     */
    this.audioPaths = [];
    /** @type {HTMLAudioElement} */
    this.audio = new Audio();
    this.socresound = new Audio("/audio/score-sound.mp3");
    this.typesound = new Audio("/audio/typeSound.mp3");
    /**
     * it or normal
     */
    this.mode = "";
    /**
     * difficulty
     */
    this.difficulty = "";
    /**
     * speaker
     */
    this.speaker = "";
    /**
     * speaker path
     */
    this.speaker_img = {
      3: "/images/zunda_normal.png",
      8: "/images/tsumugi_normal.png",
      2: "/images/metan_normal.png",
    };
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
    this.highScore =
      !localStorage.getItem("highscore") ||
      isNaN(localStorage.getItem("highscore"))
        ? 0
        : parseInt(localStorage.getItem("highscore"));
    this.kanaView = document.getElementById("wordKana");
    this.romanView = document.getElementById("wordRoman");
    this.charaView = document.getElementById("chara_img");
    this.limitTime = 60000; // ms
    this.limitValues = { low: 60000, middle: 40000, high: 20000 }; // ms
    this.scoreRate = { low: 4, middle: 9, high: 21 }; //

    window.addEventListener("keydown", (e) => this.pushKeydown(e));
  }

  /**
   * Initializes the game screen.
   */
  initialize() {
    // ゲーム画面の初期化ロジックをここに追加
    this.audio.volume = this.screenManager.volume * 0.01;
    this.socresound.volume = this.screenManager.se * 0.01;
    this.typesound.volume = this.screenManager.se * 0.01;
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
    this.questions = [...this.words[this.difficulty][this.mode]];
    // 音声生成
    this.generateAudio();
    // 問題の選択
    this.currentQuestion =
      this.questions[Math.floor(Math.random() * this.questions.length)];
    //制限時間の更新
    this.limitTime = this.limitValues[this.difficulty];
    // 問題の表示
    this.updateQuestion();
    this.updateScoreDisplay();
    // キャラ絵初期化
    this.initCharacter();
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

    if (event.code === "Space") {
      // 半角スペースの時だけ実行したい
      event.preventDefault();
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
        this.currentTotal +=
          this.currentQuestion.key.length * this.scoreRate[this.difficulty];
        this.updateScoreDisplay();

        // 正解した問題を削除
        const questionIndex = this.questions.findIndex(
          (question) => question.key === this.currentQuestion.key,
        );
        if (questionIndex !== -1) {
          this.questions.splice(questionIndex, 1);
          this.audioPaths.splice(questionIndex, 1); // audioPaths も対応する位置で削除
        }

        // すべての問題を出題し終えたらリセット
        if (this.questions.length === 0) {
          this.questions = [...this.words[this.difficulty][this.mode]]; // 最初の状態に戻す
          this.generateAudio(); // 新たに問題をリセットしたら音声も再生成
        }

        // 問題の選択
        this.currentQuestion =
          this.questions[Math.floor(Math.random() * this.questions.length)];
        // 問題の表示
        this.updateQuestion();
      }
    }

    this.typesound.currentTime = 0;
    this.typesound.play();
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
    this.updateScores();
    this.resultSound();
    this.screenManager.showScreen("game-result");
    this.gameResultScreen.showResult();
  }

  resultSound() {
    this.socresound.currentTime = 0; // 効果音をリセット
    this.socresound.play(); // 効果音を再生
  }

  /**
   * ハイスコアと今回のスコアをscreenmManagerの変数(?)に格納
   */
  updateScores() {
    this.highScore =
      this.highScore < this.currentTotal ? this.currentTotal : this.highScore;
    console.log("highScore:" + this.highScore);
    console.log("currentTotal:" + this.currentTotal);
    localStorage.setItem("highscore", this.highScore);
  }

  /**
   * 音声の生成
   */
  generateAudio() {
    this.audioPaths = this.questions.map(
      (question) => `/voicevox?text=${question.word}&speaker=${this.speaker}`,
    );
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

  /**
   * 表示キャラクターの更新
   */
  initCharacter() {
    this.charaView.src = this.speaker_img[this.speaker];
  }
}
